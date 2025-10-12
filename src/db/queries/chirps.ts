import { eq } from 'drizzle-orm';
import { db } from '../index.js'
import { chirps, NewChirp } from '../schema.js'

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
    return result;
}

export async function listAllChirps() {
    const query = await db
        .select()
        .from(chirps)
        .orderBy(chirps.createdAt)
    return query ?? null;
}

export async function getChirp(chirpId: string) {
    const [query] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId))
    return query ?? null
}