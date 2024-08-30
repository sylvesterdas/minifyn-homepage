import { Pool } from 'pg';
import { sql, SQLStatement } from 'sql-template-tag';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = {
  query: (text, params) => {
    if (text instanceof SQLStatement) {
      return pool.query(text.text, text.values);
    }
    return pool.query(text, params);
  },
  sql: sql
};

export default db;
