import { Pool } from 'pg';
import SQL from 'sql-template-tag';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = {
  query: (text, params) => {
    return pool.query(text, params);
  },
  sql: SQL
};

export default db;
