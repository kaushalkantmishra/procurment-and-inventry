import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  database: {
    url: process.env.DATABASE_URL!
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  app: {
    isDev: process.env.NODE_ENV === 'development',
  },
};
