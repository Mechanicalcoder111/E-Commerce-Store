import { Router } from 'express';
import { prisma } from '../storage/databases/Prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { logger } from '../services/LoggerService.js';

const router = Router();

// Get all users (Admin only)
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ users });
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
);

// Delete user (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req: AuthRequest, res) => {
    try {
      // Prevent self-deletion
      if (req.params.id === req.user!.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      await prisma.user.delete({
        where: { id: req.params.id }
      });

      logger.info('User deleted:', { userId: req.params.id });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);

export default router;
