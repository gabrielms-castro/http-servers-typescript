import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema.js'
import { apiConfig } from '../api/configs.js'

const conn = postgres(apiConfig.dbURL);
export const db = drizzle(conn, { schema });