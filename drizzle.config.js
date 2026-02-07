
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local', override: false });
loadEnv();
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: "./utils/schema.jsx",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL || process.env.DATABASE_URL,
  },
})
