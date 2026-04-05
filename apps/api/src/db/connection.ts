import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
  return res;
};

export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

export const testConnection = async (retries = 5, delay = 2000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      console.log('✅ Database connected successfully at:', result.rows[0].now);
      client.release();
      return;
    } catch (error: any) {
      const isLastAttempt = i === retries - 1;

      if (error.code === 'EAI_AGAIN' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        console.warn(`⚠️  Database connection attempt ${i + 1}/${retries} failed (DNS/Network issue). ${isLastAttempt ? 'Final attempt failed.' : `Retrying in ${delay / 1000}s...`}`);

        if (!isLastAttempt) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }
};

export default pool; 