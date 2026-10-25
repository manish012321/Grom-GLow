const fs = require('fs');
const path = require('path');
require('dotenv').config();

let db;
let isPostgres = false;

if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  isPostgres = true;

  db = {
    async query(text, params = []) {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      return res;
    },
    async close() {
      await pool.end();
    }
  };
} else {
  const Database = require('better-sqlite3');
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'groom_and_glow.db');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  db = {
    async query(text, params = []) {
      // Normalize PostgreSQL $1, $2, $3 to ? for SQLite
      let normalizedSql = text;
      // Replace $1, $2, etc. with ?
      normalizedSql = normalizedSql.replace(/\$\d+/g, '?');

      const trimmed = normalizedSql.trim();
      const isSelect = /^SELECT/i.test(trimmed);
      const hasReturning = /RETURNING/i.test(trimmed);

      try {
        const stmt = sqlite.prepare(normalizedSql);
        if (isSelect || hasReturning) {
          const rows = stmt.all(...params);
          return { rows, rowCount: rows.length };
        } else {
          const info = stmt.run(...params);
          return {
            rows: [],
            rowCount: info.changes,
            lastInsertRowid: info.lastInsertRowid
          };
        }
      } catch (err) {
        console.error('Database query error:', err.message, 'in query:', text);
        throw err;
      }
    },
    async close() {
      sqlite.close();
    }
  };
}

module.exports = {
  db,
  isPostgres
};
