import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',

  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || '6379',
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: process.env.REDIS_DB || '0',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN || '86400'), // 1 day in seconds

  // Legacy MySQL (for one-time migration)
  LEGACY_MYSQL_HOST: process.env.LEGACY_MYSQL_HOST || 'blitz.cs.niu.edu',
  LEGACY_MYSQL_PORT: parseInt(process.env.LEGACY_MYSQL_PORT || '3306'),
  LEGACY_MYSQL_USER: process.env.LEGACY_MYSQL_USER || 'student',
  LEGACY_MYSQL_PASSWORD: process.env.LEGACY_MYSQL_PASSWORD || 'student',
  LEGACY_MYSQL_DATABASE: process.env.LEGACY_MYSQL_DATABASE || 'csci467',

  // Email (Resend)
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  EMAIL_FROM: process.env.EMAIL_FROM || 'orders@autoparts.com',

  // Credit Card API
  CC_API_URL: process.env.CC_API_URL || 'http://blitz.cs.niu.edu/CreditCard/',
  CC_VENDOR: process.env.CC_VENDOR || 'CSCI467-2A',

  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

// Validate required env vars
const required = ['DATABASE_URL', 'JWT_SECRET', 'RESEND_API_KEY'];
for (const key of required) {
  if (!env[key as keyof typeof env]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
