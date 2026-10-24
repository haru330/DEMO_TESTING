import { PGlite } from "@electric-sql/pglite";
import { drizzle, type PgliteDatabase } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema";

export type Db = PgliteDatabase<typeof schema>;

const MIGRATIONS = "./drizzle";

/** A fresh, migrated database. Pass a directory to persist it; omit for in-memory. */
export async function createDb(dataDir?: string): Promise<Db> {
  const db = drizzle(new PGlite(dataDir), { schema });
  await migrate(db, { migrationsFolder: MIGRATIONS });
  return db;
}

// One database per server process. Kept on globalThis so dev hot reloads reuse it.
const globalForDb = globalThis as unknown as { pantryDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  globalForDb.pantryDb ??= createDb(
    process.env.PANTRY_DB_DIR ?? (process.env.VITEST ? undefined : ".data/pglite"),
  );
  return globalForDb.pantryDb;
}

/** Tests call this to start each case from an empty database. */
export function resetDbForTests() {
  globalForDb.pantryDb = undefined;
}
