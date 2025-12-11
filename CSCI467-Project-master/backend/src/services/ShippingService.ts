import { prisma } from '../storage/databases/Prisma.js';
import { logger } from './LoggerService.js';

export async function calculateShippingCost(totalWeight: number): Promise<number> {
  try {
    const bracket = await prisma.shippingBracket.findFirst({
      where: {
        minWeight: { lte: totalWeight },
        maxWeight: { gte: totalWeight }
      }
    });

    if (!bracket) {
      logger.warn('No shipping bracket found for weight:', { totalWeight });
      // Default shipping cost if no bracket found
      return 10.0;
    }

    return bracket.cost;
  } catch (error) {
    logger.error('Error calculating shipping cost:', error);
    return 10.0; // Fallback
  }
}
