import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./src/db/local.db",
  },
  verbose: true,
  strict: true,
});