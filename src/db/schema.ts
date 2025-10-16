import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid("id").primaryKey().defaultRandom(),
    hashedPassword: varchar('hashed_password', { length: 256 }).notNull().default('unset'),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date),
    email: varchar("email", { "length": 256 }).unique().notNull()
})

export type NewUser = typeof users.$inferInsert;
export type UserResponse = Omit<NewUser, 'hashedPassword'>;

export const chirps = pgTable('chirps', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    body: varchar('body', { 'length': 140 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date),    
})

export type NewChirp = typeof chirps.$inferInsert;