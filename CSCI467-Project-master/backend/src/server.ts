import express from 'express';
import {logger} from './services/LoggerService.js';
import { initPrisma, disconnectPrisma} from './storage/databases/Prisma.js';

// Import middleware
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRouter from './routes/AuthRoute.js';
import productRouter from './routes/ProductRoute.js';
import orderRouter from './routes/OrderRoute.js';
import inventoryRouter from './routes/InventoryRoute.js';
import shippingRouter from './routes/ShippingRoute.js';
import userRouter from './routes/UserRoute.js';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://csci467.shaivilpatel.me',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-id'],
  credentials: true
}));

app.disable('x-powered-by');
app.set('trust proxy', 1);

// Setup JsonParser and urlencoded parser
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Enable Gzip compression
app.use(compression());

// Setup routing
app.use('/v1/auth', authRouter);
app.use('/v1/products', productRouter);
app.use('/v1/orders', orderRouter);
app.use('/v1/inventory', inventoryRouter);
app.use('/v1/shipping', shippingRouter);
app.use('/v1/users', userRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req: any, res: any) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

logger.info('Starting Auto Parts Backend\n');

logger.info('Connecting to PostgreSQL database');
await initPrisma();

const PORT = process.env.PORT || '5000';
await app.listen(PORT, () => {
  logger.info(`Auto Parts Backend is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled rejection:', reason);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await disconnectPrisma();
  process.exit(0);
});



