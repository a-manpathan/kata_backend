//import { pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { pgTable, uuid, text, timestamp, varchar, decimal, integer } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['user', 'admin'] }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

  
  // UPDATED SWEETS TABLE
  export const sweets = pgTable('sweets', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(), // New
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull().default(0), // Renamed from inventory
    createdAt: timestamp('created_at').defaultNow(),
  });