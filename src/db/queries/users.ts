import { db } from '../index.js'
import { users } from '../schema.js'
import { eq } from 'drizzle-orm'

export async function createUser(email: string) {
    const [result] = await db
        .insert(users)
        .values({ email: email })
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getUser(email: string) {
    const [query] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
    return query ?? null;
}