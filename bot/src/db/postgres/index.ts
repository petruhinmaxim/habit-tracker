import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';
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
  } else {
    console.log(`[DB] Loaded .env from: ${envPath}`);
    console.log(`[DB] DATABASE_URL is set: ${!!process.env.DATABASE_URL}`);
  }
} else {
  // Fallback: try to load from default locations
  dotenv.config();
  console.warn('Warning: .env file not found in expected locations, using default dotenv.config()');
  console.warn('Tried paths:', possiblePaths);
  console.warn(`Current working directory: ${process.cwd()}`);
  console.warn(`__dirname: ${__dirname}`);
}

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in environment variables');
  if (envPath) {
    console.error(`Loaded .env from: ${envPath}`);
  }
  throw new Error('DATABASE_URL is required but not set');
}

// Validate DATABASE_URL format
const databaseUrl = process.env.DATABASE_URL;
if (typeof databaseUrl !== 'string') {
  console.error('ERROR: DATABASE_URL is not a string:', typeof databaseUrl, databaseUrl);
  throw new Error('DATABASE_URL must be a string');
}

if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  console.error('ERROR: DATABASE_URL must start with postgresql:// or postgres://');
  throw new Error('Invalid DATABASE_URL format');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, { schema });

