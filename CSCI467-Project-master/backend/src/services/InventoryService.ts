import { prisma } from '../storage/databases/Prisma.js';
import { logger } from './LoggerService.js';

export async function checkInventoryAvailability(
  items: Array<{ productId: string; quantity: number }>
): Promise<{ available: boolean; insufficientProducts: string[] }> {
  const insufficientProducts: string[] = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { id: true, name: true, quantity: true }
    });

    if (!product || product.quantity < item.quantity) {
      insufficientProducts.push(product?.name || item.productId);
    }
  }

  return {
    available: insufficientProducts.length === 0,
    insufficientProducts
  };
}

export async function deductInventory(
  orderId: string,
  items: Array<{ productId: string; quantity: number }>,
  userId?: string
): Promise<void> {
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    });

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    const newQuantity = product.quantity - item.quantity;

    await prisma.$transaction([
      prisma.product.update({
        where: { id: item.productId },
        data: { quantity: newQuantity }
      }),
      prisma.inventoryLog.create({
        data: {
          productId: item.productId,
          userId: userId || null,
          quantityChange: -item.quantity,
          quantityAfter: newQuantity,
          reason: 'ORDER_PLACED',
          orderId
        }
      })
    ]);
  }

  logger.info('Inventory deducted for order:', { orderId });
}

export async function restoreInventory(
  orderId: string,
  items: Array<{ productId: string; quantity: number }>,
  userId?: string
): Promise<void> {
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    });

    if (!product) {
      logger.warn('Product not found during inventory restore:', {
        productId: item.productId
      });
      continue;
    }

    const newQuantity = product.quantity + item.quantity;

    await prisma.$transaction([
      prisma.product.update({
        where: { id: item.productId },
        data: { quantity: newQuantity }
      }),
      prisma.inventoryLog.create({
        data: {
          productId: item.productId,
          userId: userId || null,
          quantityChange: item.quantity,
          quantityAfter: newQuantity,
          reason: 'ORDER_CANCELLED',
          orderId
        }
      })
    ]);
  }

  logger.info('Inventory restored for cancelled order:', { orderId });
}

export async function addInventory(
  productId: string,
  quantity: number,
  userId: string
): Promise<void> {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const newQuantity = product.quantity + quantity;

  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { quantity: newQuantity }
    }),
    prisma.inventoryLog.create({
      data: {
        productId,
        userId,
        quantityChange: quantity,
        quantityAfter: newQuantity,
        reason: 'STOCK_ADDED'
      }
    })
  ]);

  logger.info('Inventory added:', { productId, quantity, userId });
}
