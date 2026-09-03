import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getClient } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');

async function runMigrations() {
  let client;
  try {
    client = await getClient();
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    const { rows } = await client.query('SELECT name FROM _migrations');
    const appliedMigrations = new Set(rows.map(row => row.name));

    for (const file of files) {
      if (!appliedMigrations.has(file)) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
        
        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`Successfully applied: ${file}`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`Error applying migration ${file}:`, error);
          throw error;
        }
      }
    }
    console.log('All migrations applied successfully.');
  } catch (error) {
    console.error('Migration failed:', error.message || error);
    throw error;
  } finally {
    if (client) client.release();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations().then(() => process.exit(0)).catch((err) => {
    console.error('Failed to run migrations. Please check your PostgreSQL connection.');
    process.exit(1);
  });
}

export { runMigrations };
