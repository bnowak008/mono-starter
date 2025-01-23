import { defineConfig } from "drizzle-kit";
import { join } from "path";

export default defineConfig({
  schema: "./src/db/schema/",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: join(process.cwd(), "src/db/local.db"),
  },
  verbose: true,
  strict: true,
});
