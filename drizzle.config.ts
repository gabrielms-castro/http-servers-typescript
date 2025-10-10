import { defineConfig } from "drizzle-kit";
import { config } from './src/configs'

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/generated/",
  dialect: "postgresql",
  dbCredentials: {
    url: config.db.url
}});