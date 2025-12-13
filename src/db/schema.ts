import { pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['user', 'admin'] }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});