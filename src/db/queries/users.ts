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
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function deleteUsers() {
    const [result] = await db
        .delete(users)
        .returning();
    return result
}

export async function editUserCredentials(userId: string, newEmail?: string, newHashedPassword?: string) {
    const [result] = await db
        .update(users)
        .set({
            email: newEmail,
            hashedPassword: newHashedPassword
        })
        .where(eq(users.id, userId))
        .returning();
    return result; 
}