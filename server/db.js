import 'dotenv/config';
import pg from 'pg';

// Koneksi ke PostgreSQL (Supabase). max kecil karena berjalan sebagai serverless function
export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 10000,
});
