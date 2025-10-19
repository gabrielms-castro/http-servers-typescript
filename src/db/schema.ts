import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable('users', {
    id: uuid("id").primaryKey().defaultRandom(),
    hashedPassword: varchar('hashed_password', { length: 256 }).notNull().default('unset'),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date),
    email: varchar("email", { "length": 256 }).unique().notNull()
})


export const chirps = pgTable('chirps', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    body: varchar('body', { 'length': 140 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date),    
})

export const refreshTokens = pgTable('refresh_tokens', {
    token: varchar('token', {length: 256 }).primaryKey().notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at').default(sql`NULL`),
})

export type NewUser = typeof users.$inferInsert;
export type UserResponse = Omit<NewUser, 'hashedPassword'>;
export type NewChirp = typeof chirps.$inferInsert;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;