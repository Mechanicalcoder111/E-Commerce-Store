import { Router } from 'express';
import { prisma } from '../storage/databases/Prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { validators } from '../validators/index.js';
import { addInventory } from '../services/InventoryService.js';
import { logger } from '../services/LoggerService.js';

const router = Router();

// Add inventory (Receiving Desk or Admin)
router.post(
  '/add',
  authenticate,
  authorize('RECEIVING_DESK', 'ADMIN'),
  validate(validators.addInventory),
  async (req: AuthRequest, res) => {
    try {
      const { productId, quantity } = req.body;

      await addInventory(productId, quantity, req.user!.id);

      res.json({ message: 'Inventory added successfully' });
    } catch (error) {
      logger.error('Add inventory error:', error);
      res.status(500).json({ error: 'Failed to add inventory' });
    }
  }
);

// Get inventory history (Admin only)
router.get(
  '/history/:productId',
  authenticate,
  authorize('ADMIN'),
  async (req, res) => {
    try {
      const logs = await prisma.inventoryLog.findMany({
        where: { productId: req.params.productId },
        include: {
          user: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ logs });
    } catch (error) {
      logger.error('Get inventory history error:', error);
      res.status(500).json({ error: 'Failed to fetch inventory history' });
    }
  }
);

export default router;
