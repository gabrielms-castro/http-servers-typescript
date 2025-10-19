import { eq } from 'drizzle-orm'

import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(token: NewRefreshToken) {
    const [result] = await db
        .insert(refreshTokens)
        .values(token)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getRefreshToken(refreshToken: string) {
    const [query] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken))
    return query ?? undefined;
}

export async function revokeRefreshToken(token: string, revokedAt: Date) {
    const [result] = await db
        .update(refreshTokens)
        .set({ revokedAt: revokedAt })
        .where(eq(refreshTokens.token, token))
        .returning();
    return result;
}