import { env } from '../config/env.js';
import { logger } from './LoggerService.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../storage/databases/Prisma.js';

export async function generateJwtToken(userId: string) {
  const jti = uuidv4();
  const payload = {
    sub: userId,
    jti: jti
  }

  return jwt.sign(payload, env.JWT_SECRET!,{
    algorithm: 'HS512',
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export async function expireToken(token: string) : Promise<void> {
    try {
      // Decode the token to get jti and expiration
      const decoded = jwt.decode(token, { complete: true });

      const { jti, exp } = decoded?.payload as { jti: string; exp: number };

      if (!jti || !exp) {
        logger.error('Invalid token structure, missing jti or exp');
        throw new Error('Token missing jti or exp');
      }

      const expiresAt = new Date(exp * 1000);

      // Store token in blacklist
      await prisma.blacklistedToken.create({
        data: {
          token: jti,
          expiresAt,
        },
      });

      logger.info(`Token ${jti} blacklisted until ${expiresAt.toISOString()}`);
    } catch (error) {
      logger.error('Error blacklisting JWT token:', error);
      throw error;
    }
}

export async function isTokenBlacklisted(jti: string): Promise<boolean> {
  try {
    const blacklistedToken = await prisma.blacklistedToken.findUnique({
      where: { token: jti },
    });

    // Token is blacklisted if it exists in the database
    return blacklistedToken !== null;
  } catch (error) {
    logger.error('Error checking token blacklist status:', error);
    // Fail closed - if we can't check, assume it's not blacklisted
    return false;
  }
}

/**
 * Clean up expired tokens from the blacklist table
 * This should be run periodically (e.g., via a cron job)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.blacklistedToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      logger.info(`Cleaned up ${result.count} expired blacklisted tokens`);
    }

    return result.count;
  } catch (error) {
    logger.error('Error cleaning up expired tokens:', error);
    return 0;
  }
}


