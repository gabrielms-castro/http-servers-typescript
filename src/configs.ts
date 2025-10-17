
import type { MigrationConfig } from "drizzle-orm/migrator"

// Defining config types here
type Config = {
    api: APIConfig;
    db: DBConfig
}
// hold stateful in-memory data to keep track the number of requests that the server processed
type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
    secret: string;
}

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig
}

// loading .env variables
process.loadEnvFile();

export function envOrThrow(key: string): string {  
    const dotEnvValue = process.env[key];
    if (!dotEnvValue) {
        throw new Error(`Missing .env variable: ${key}`);
    }
    return dotEnvValue;
}

export const maxChirpsLenght = 140;
export const profaneWords: Array<string> = [
    "kerfuffle", 
    "sharbert", 
    "fornax"
]

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/generated/"
}

export const config: Config = {
    api: {
        fileserverHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow('PLATFORM'),
        secret: envOrThrow('TOKEN_STRING')
    },
    db: {
        url: envOrThrow('DB_URL'),
        migrationConfig: migrationConfig
    }
}
