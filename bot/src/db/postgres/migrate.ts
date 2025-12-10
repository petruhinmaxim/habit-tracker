import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try multiple paths for .env file
// 1. From current working directory (when run from bot/)
// 2. From project root (when run from root)
// 3. Relative to this file
const possiblePaths = [
  resolve(process.cwd(), '../.env'), // From bot/ to root
  resolve(process.cwd(), '.env'),    // If run from root
  join(__dirname, '../../../.env'),  // Relative to this file
];

let envPath: string | undefined;
for (const path of possiblePaths) {
  if (existsSync(path)) {
    envPath = path;
    break;
  }
}

if (envPath) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.warn(`Warning: Could not load .env from ${envPath}:`, result.error.message);
  }
} else {
  // Fallback: try to load from default locations
  dotenv.config();
  console.warn('Warning: .env file not found in expected locations, using default dotenv.config()');
  console.warn('Tried paths:', possiblePaths);
}

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in environment variables');
  if (envPath) {
    console.error(`Loaded .env from: ${envPath}`);
  }
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function runMigrations() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed!');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

