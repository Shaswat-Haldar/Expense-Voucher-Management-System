import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();

