process.loadEnvFile();

export const maxChirpsLenght = 140;
export const profaneWords: Array<string> = [
    "kerfuffle", 
    "sharbert", 
    "fornax"
]

// hold stateful in-memory data to keep track the number of requests that the server processed
export type APIConfig = {
    fileserverHits: number;
    dbURL: string
}

export function envOrThrow(key: string): string {  
    const dotEnvValue = process.env[key];
    if (!dotEnvValue) {
        throw new Error(`Missing .env variable: ${key}`);
    }
    return dotEnvValue;
}

export const apiConfig: APIConfig = {
    fileserverHits: 0,
    dbURL: envOrThrow('DB_URL')
}
