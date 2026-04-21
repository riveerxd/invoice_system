const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function waitForDb(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connected');
      return;
    } catch (err) {
      console.log(`Waiting for database... (${i + 1}/${retries})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Could not connect to database');
}

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoices      (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS clients       (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS bank_accounts (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS taxes         (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS team          (key TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS users         (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);
}

async function seedDefaultUser() {
  const bcrypt = require('bcryptjs');
  const username = process.env.APP_USERNAME || 'admin';
  const password = process.env.APP_PASSWORD || 'admin';

  const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  if (existing.rows.length === 0) {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, hash]);
    console.log(`Created default user: ${username}`);
  }
}

async function init() {
  await waitForDb();
  await initSchema();
  await seedDefaultUser();
}

module.exports = { pool, init, query: (text, params) => pool.query(text, params) };
