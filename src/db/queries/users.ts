import { db } from '../index.js'
import { NewUser, users } from '../schema.js'
import { eq } from 'drizzle-orm'

export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
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

export async function deleteUsers() {
    const [result] = await db
        .delete(users)
        .returning();
    return result
}