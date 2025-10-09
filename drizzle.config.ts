import { defineConfig } from "drizzle-kit";
import { apiConfig } from './src/api/configs'
export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/generated/",
  dialect: "postgresql",
  dbCredentials: {
    url: apiConfig.dbURL
  },
});