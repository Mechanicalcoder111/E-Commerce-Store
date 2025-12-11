import { cleanupExpiredTokens } from '../services/AuthService.js';
import { logger } from '../services/LoggerService.js';
import { prisma } from '../storage/databases/Prisma.js';

async function main() {
  try {
    logger.info('Starting cleanup of expired blacklisted tokens...');
    const count = await cleanupExpiredTokens();
    logger.info(`Cleanup completed. Removed ${count} expired tokens.`);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Cleanup failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
