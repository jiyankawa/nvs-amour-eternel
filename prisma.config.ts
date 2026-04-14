import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // For migrations CLI only — runtime uses driver adapters
    url: process.env["DATABASE_URL"] || "file:./dev.db",
  },
});
