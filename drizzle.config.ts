import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // Mudar para "sqlite" ou "mysql" se necessário
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["!*_old"],
  introspect: {
    casing: "camelCase",
  },
  strict: true,
  verbose: true,
} satisfies Config;