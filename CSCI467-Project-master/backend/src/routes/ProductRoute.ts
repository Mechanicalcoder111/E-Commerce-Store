import { Router } from 'express';
import { prisma } from '../storage/databases/Prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { validators } from '../validators/index.js';
import { logger } from '../services/LoggerService.js';

const router = Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ products });
  } catch (error) {
    logger.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    logger.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (Admin only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(validators.createProduct),
  async (req, res) => {
    try {
      const product = await prisma.product.create({
        data: req.body
      });

      logger.info('Product created:', { productId: product.id, name: product.name });

      res.status(201).json({ product });
    } catch (error) {
      logger.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(validators.updateProduct),
  async (req, res) => {
    try {
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body
      });

      logger.info('Product updated:', { productId: product.id });

      res.json({ product });
    } catch (error) {
      logger.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
);

// Delete product (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req, res) => {
    try {
      await prisma.product.delete({
        where: { id: req.params.id }
      });

      logger.info('Product deleted:', { productId: req.params.id });

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      logger.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
);

export default router;
