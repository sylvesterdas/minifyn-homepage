import { Pool } from 'pg';
import SQL from 'sql-template-tag';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const db = {
  query: async (text, params, retries = 3) => {
    try {
      return await pool.query(text, params);
    } catch (error) {
      if (retries > 0 && error.message.includes('Connection terminated')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return db.query(text, params, retries - 1);
      }
      throw error;
    }
  },
  sql: SQL
};

export default db;