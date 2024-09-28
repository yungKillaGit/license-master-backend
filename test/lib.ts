import { sql } from 'drizzle-orm';
import { beforeAll } from 'vitest';
import { app } from '@/app';
import { db } from '@/db';

export const clearDB = async () => {
  try {
    const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

    app.log.debug('Get all tables');
    const tables = await db.execute(query);

    app.log.debug('Truncate all tables');
    for (const table of tables) {
      const sqlQuery = `TRUNCATE TABLE ${table.table_name} CASCADE;`;
      app.log.debug(sqlQuery);
      const query = sql.raw(sqlQuery);
      await db.execute(query);
    }
    app.log.debug('DB was cleared');
  } catch (error) {
    app.log.error(error);
  }
};

export const beforeAllTests = async () => {
  beforeAll(async () => {
    await clearDB();
  });
};
