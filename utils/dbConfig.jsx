import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';


const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('Database connection string is not defined. Set NEXT_PUBLIC_DATABASE_URL or DATABASE_URL in your environment.');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export { sql };