import { PrismaClient } from '@prisma/client';
import { logger } from '../../services/LoggerService.js';
import { env } from '../../config/env.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function initPrisma(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database via Prisma');
  } catch (error) {
    logger.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
  logger.info('Database disconnected');
}

async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export { prisma, initPrisma, disconnectPrisma, healthCheck };
