import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from '../domains/users/model';

export const sessions = pgTable('sessions', {
  sessionId: text('session_id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
});
