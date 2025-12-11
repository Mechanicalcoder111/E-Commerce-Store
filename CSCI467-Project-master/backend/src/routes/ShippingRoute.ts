import { Router } from 'express';
import { prisma } from '../storage/databases/Prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { validators } from '../validators/index.js';
import { logger } from '../services/LoggerService.js';

const router = Router();

// Get shipping brackets (public)
router.get('/', async (req, res) => {
  try {
    const brackets = await prisma.shippingBracket.findMany({
      orderBy: { minWeight: 'asc' }
    });

    res.json({ brackets });
  } catch (error) {
    logger.error('Get shipping brackets error:', error);
    res.status(500).json({ error: 'Failed to fetch shipping brackets' });
  }
});

// Create shipping bracket (Admin only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(validators.createShippingBracket),
  async (req, res) => {
    try {
      const bracket = await prisma.shippingBracket.create({
        data: req.body
      });

      logger.info('Shipping bracket created:', { bracketId: bracket.id });

      res.status(201).json({ bracket });
    } catch (error) {
      logger.error('Create shipping bracket error:', error);
      res.status(500).json({ error: 'Failed to create shipping bracket' });
    }
  }
);

// Update shipping bracket (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(validators.updateShippingBracket),
  async (req, res) => {
    try {
      const bracket = await prisma.shippingBracket.update({
        where: { id: req.params.id },
        data: req.body
      });

      logger.info('Shipping bracket updated:', { bracketId: bracket.id });

      res.json({ bracket });
    } catch (error) {
      logger.error('Update shipping bracket error:', error);
      res.status(500).json({ error: 'Failed to update shipping bracket' });
    }
  }
);

// Delete shipping bracket (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req, res) => {
    try {
      await prisma.shippingBracket.delete({
        where: { id: req.params.id }
      });

      logger.info('Shipping bracket deleted:', { bracketId: req.params.id });

      res.json({ message: 'Shipping bracket deleted successfully' });
    } catch (error) {
      logger.error('Delete shipping bracket error:', error);
      res.status(500).json({ error: 'Failed to delete shipping bracket' });
    }
  }
);

export default router;
