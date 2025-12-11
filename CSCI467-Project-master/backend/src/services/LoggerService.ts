import winston, { format } from 'winston';
import { CustomConsoleTransport } from './transports/CustomConsoleTransport.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';
import path from 'path';
import { env } from '../config/env.js'
import dotenv from 'dotenv';

dotenv.config();

const safeStringify = (obj: any) => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    return value;
  });
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Environment-specific configuration
const isDevelopment = process.env.NODE_ENV === 'development';

const generateLogId = (): string => randomBytes(8).toString('hex');

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
  format.json(),
  format.printf(({ timestamp, level, message, logId, correlationId, ...meta }) => {
    const logEntry = {
      timestamp,
      level,
      logId: logId || generateLogId(),
      message,
      service: 'helix-backend',
      environment: process.env.NODE_ENV || 'development',
      ...(correlationId && { correlationId }),
      ...meta
    };
    return safeStringify(logEntry);
  })
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// File paths
const combinedLogFile = path.join(logsDir, 'csci467-backend.log');
const errorLogFile = path.join(logsDir, 'csci467-error.log');

if (isDevelopment) {
  try {
    fs.unlinkSync(combinedLogFile);
  } catch (ex) {
    // file didn't exist
  }
}

// Logger configuration
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: {
    service: 'vici-backend'
  },
  transports: [
  ]
});

// Console transport for development
logger.add(new CustomConsoleTransport({
  name: 'CustomConsoleTransport',
  level: isDevelopment ? 'debug' : 'info'
}));

// File transport 
logger.add(new winston.transports.File({
  filename: combinedLogFile, 
  level: 'info',
  maxsize: 512000000,
  maxFiles: 10,
  tailable: true
}));

// Seperate file for errors
logger.add(new winston.transports.File({
  filename: errorLogFile,
  level: 'error',
  maxsize: 512000000,
  maxFiles: 10,
  tailable: true
}));

export { logger };
