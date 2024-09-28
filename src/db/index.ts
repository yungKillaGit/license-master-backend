import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { configuration } from '@/config';

const { DB_DATABASE, DB_DATABASE_TEST, DB_HOST, DB_MAX_CONNECTIONS, DB_PASSWORD, DB_PORT, DB_SSL, DB_USER, NODE_ENV } = configuration;

const pg = postgres({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: NODE_ENV === 'test' ? DB_DATABASE_TEST : DB_DATABASE,
  ssl: DB_SSL,
  max: DB_MAX_CONNECTIONS,
  onnotice: () => {},
});

export const db = drizzle(pg);
