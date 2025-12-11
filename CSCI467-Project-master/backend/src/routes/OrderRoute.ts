import { Router } from 'express';
import { prisma } from '../storage/databases/Prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { validators } from '../validators/index.js';
import { logger } from '../services/LoggerService.js';
import { processCreditCard, refundCreditCard } from '../services/CreditCardService.js';
import { calculateShippingCost } from '../services/ShippingService.js';
import {
  checkInventoryAvailability,
  deductInventory,
  restoreInventory
} from '../services/InventoryService.js';
import {
  sendOrderConfirmation,
  sendShippingConfirmation,
  sendCancellationEmail
} from '../services/EmailService.js';

const router = Router();

// Create order (public)
router.post('/', validate(validators.createOrder), async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      creditCard,
      creditCardName,
      creditCardExpiry,
      items
    } = req.body;

    // 1. Check inventory availability
    const inventoryCheck = await checkInventoryAvailability(items);
    if (!inventoryCheck.available) {
      return res.status(400).json({
        error: 'Insufficient inventory',
        insufficientProducts: inventoryCheck.insufficientProducts
      });
    }

    // 2. Fetch products and calculate totals
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } }
    });

    let subtotal = 0;
    let totalWeight = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      subtotal += product.price * item.quantity;
      totalWeight += product.weight * item.quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        priceAtTime: product.price,
        weightAtTime: product.weight
      });
    }

    // 3. Calculate shipping
    const shippingCost = await calculateShippingCost(totalWeight);
    const totalAmount = subtotal + shippingCost;

    // 4. Create placeholder order
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
        shippingCountry: shippingCountry || 'USA',
        cardLast4: creditCard.slice(-4),
        ccAuthNumber: 'PENDING',
        ccTransactionId: `TEMP-${Date.now()}`,
        subtotal,
        shippingCost,
        totalWeight,
        totalAmount,
        status: 'ORDERED',
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // 5. Process credit card
    const ccResult = await processCreditCard(
      order.id,
      creditCard,
      creditCardName,
      creditCardExpiry,
      totalAmount
    );

    if (!ccResult.success) {
      // Delete order if payment fails
      await prisma.order.delete({ where: { id: order.id } });
      return res.status(400).json({ error: ccResult.error });
    }

    // 6. Update order with auth number
    await prisma.order.update({
      where: { id: order.id },
      data: {
        ccAuthNumber: ccResult.authNumber!,
        ccTransactionId: `ORDER-${order.id}-${Date.now()}`
      }
    });

    // 7. Deduct inventory
    await deductInventory(order.id, items);

    // 8. Send confirmation email
    await sendOrderConfirmation({
      customerName,
      customerEmail,
      orderNumber: order.orderNumber,
      items: orderItems.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.priceAtTime
      })),
      subtotal,
      shippingCost,
      total: totalAmount
    });

    logger.info('Order created:', { orderId: order.id, orderNumber: order.orderNumber });

    res.status(201).json({ order });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get orders (Admin and Warehouse Workers)
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'WAREHOUSE_WORKER'),
  async (req: AuthRequest, res) => {
    try {
      const {
        startDate,
        endDate,
        status,
        minPrice,
        maxPrice,
        orderId,
        customerEmail,
        customerName
      } = req.query as {
        startDate?: string;
        endDate?: string;
        status?: string;
        minPrice?: string;
        maxPrice?: string;
        orderId?: string;
        customerEmail?: string;
        customerName?: string;
      };

      const where: any = {};

      if (startDate || endDate) {
        where.orderedAt = {};
        if (startDate) where.orderedAt.gte = new Date(startDate);
        if (endDate) where.orderedAt.lte = new Date(endDate);
      }

      if (status) where.status = status;

      if (minPrice || maxPrice) {
        where.totalAmount = {};
        if (minPrice) where.totalAmount.gte = parseFloat(minPrice);
        if (maxPrice) where.totalAmount.lte = parseFloat(maxPrice);
      }

      // Support searching by both UUID (id) and CUID (orderNumber)
      if (orderId) {
        // Check if it looks like a UUID or CUID
        if (orderId.includes('-') && orderId.length === 36) {
          // Looks like a UUID
          where.id = orderId;
        } else {
          // Assume it's an orderNumber (CUID)
          where.orderNumber = orderId;
        }
      }
      if (customerEmail) where.customerEmail = { contains: customerEmail };
      if (customerName) where.customerName = { contains: customerName };

      const orders = await prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          orderedAt: 'desc'
        }
      });

      res.json({ orders });
    } catch (error) {
      console.error('Get orders error FULL:', error);
      logger.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
);

// Get packing list (Warehouse Worker)
router.get(
  '/packing-list/:id',
  authenticate,
  authorize('WAREHOUSE_WORKER', 'ADMIN'),
  async (req: AuthRequest, res) => {
    try {
      const idParam = req.params.id;

      // Support both UUID (id) and CUID (orderNumber)
      const whereClause = idParam.includes('-') && idParam.length === 36
        ? { id: idParam }  // UUID
        : { orderNumber: idParam };  // CUID

      const order = await prisma.order.findUnique({
        where: whereClause,
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Auto-set status to PACKING
      if (order.status === 'ORDERED') {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PACKING',
            packingStartedAt: new Date(),
            packedById: req.user!.id
          }
        });
      }

      logger.info('Packing list viewed:', {
        orderId: order.id,
        userId: req.user!.id
      });

      res.json({ order });
    } catch (error) {
      logger.error('Get packing list error:', error);
      res.status(500).json({ error: 'Failed to fetch packing list' });
    }
  }
);

// Mark order as shipped (Warehouse Worker)
router.post(
  '/:id/ship',
  authenticate,
  authorize('WAREHOUSE_WORKER', 'ADMIN'),
  async (req, res) => {
    try {
      const idParam = req.params.id;

      // Support both UUID (id) and CUID (orderNumber)
      const whereClause = idParam.includes('-') && idParam.length === 36
        ? { id: idParam }  // UUID
        : { orderNumber: idParam };  // CUID

      const order = await prisma.order.update({
        where: whereClause,
        data: {
          status: 'SHIPPED',
          shippedAt: new Date()
        }
      });

      // Send shipping confirmation
      await sendShippingConfirmation(
        order.customerName,
        order.customerEmail,
        order.orderNumber
      );

      logger.info('Order shipped:', { orderId: order.id });

      res.json({ order });
    } catch (error) {
      logger.error('Ship order error:', error);
      res.status(500).json({ error: 'Failed to ship order' });
    }
  }
);

// Cancel order (Admin or Warehouse Worker)
router.post(
  '/:id/cancel',
  authenticate,
  authorize('ADMIN', 'WAREHOUSE_WORKER'),
  async (req: AuthRequest, res) => {
    try {
      const idParam = req.params.id;

      // Support both UUID (id) and CUID (orderNumber)
      const whereClause = idParam.includes('-') && idParam.length === 36
        ? { id: idParam }  // UUID
        : { orderNumber: idParam };  // CUID

      const order = await prisma.order.findUnique({
        where: whereClause,
        include: {
          items: true
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.status === 'SHIPPED' || order.status === 'CANCELLED') {
        return res.status(400).json({ error: 'Order cannot be cancelled' });
      }

      // Restore inventory
      await restoreInventory(
        order.id,
        order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        req.user!.id
      );

      // Refund credit card
      await refundCreditCard(order.ccAuthNumber, order.totalAmount);

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date()
        }
      });

      // Send cancellation email
      await sendCancellationEmail(
        order.customerName,
        order.customerEmail,
        order.orderNumber,
        order.totalAmount
      );

      logger.info('Order cancelled:', { orderId: order.id });

      res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
      logger.error('Cancel order error:', error);
      res.status(500).json({ error: 'Failed to cancel order' });
    }
  }
);

export default router;
