import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connected:', result.rows[0]);
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
};

// Get a client from the pool
export const getClient = () => {
  return pool.connect();
};

// Execute a query
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Close the pool
export const closePool = () => {
  return pool.end();
};

export default pool; 