import "server-only";

import { neon } from "@neondatabase/serverless";

export class DatabaseConfigurationError extends Error {
  constructor() {
    super("Database access is not configured on the server.");
    this.name = "DatabaseConfigurationError";
  }
}
export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new DatabaseConfigurationError();
  return neon(databaseUrl);
}
