import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { isTokenBlacklisted } from '../services/AuthService.js';
import { logger } from '../services/LoggerService.js';
import { prisma } from '../storage/databases/Prisma.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    console.log('AUTHENTICATE middleware called');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No auth header provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    console.log('Token found, verifying...');

    // Verify JWT
    const decoded = jwt.verify(token, env.JWT_SECRET!) as { sub: string; jti: string };
    console.log('Token verified, decoded:', decoded);

    // Check if token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(decoded.jti);
    if (isBlacklisted) {
      console.log('Token is blacklisted');
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, role: true }
    });
    console.log('User fetched:', user);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    console.log('Authentication successful, calling next()');
    next();
  } catch (error) {
    console.error('Authentication error CAUGHT:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    logger.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log('AUTHORIZE middleware called, required roles:', roles);
    console.log('User:', req.user);

    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      console.log('User role not authorized:', req.user.role);
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    console.log('Authorization successful, calling next()');
    next();
  };
}
