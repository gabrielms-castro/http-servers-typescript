
// hold stateful in-memory data to keep track the number of requests that the server processed
export type APIConfig = {
    fileserverHits: number;
}
export const apiConfig: APIConfig = {
    fileserverHits: 0
}