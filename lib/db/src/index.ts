import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Real instances will be created lazily on first use.
let realPool: pg.Pool | null = null;
let realDb: ReturnType<typeof drizzle> | null = null;

function initializeIfPossible() {
  if (realPool && realDb) return;
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Don't throw during module import — warn and defer initialization until first real use.
    // This keeps the module safe to import in environments where DATABASE_URL isn't set yet.
    console.warn(
      "lib/db: DATABASE_URL not set. Database connection will be initialized lazily when DATABASE_URL is provided.",
    );
    return;
  }

  realPool = new Pool({ connectionString: url });
  realDb = drizzle(realPool, { schema });
}

const poolProxy = new Proxy({} as pg.Pool, {
  get(_target, prop) {
    initializeIfPossible();
    if (!realPool) {
      throw new Error(
        "DATABASE_URL must be set before using the database. Set DATABASE_URL and retry.",
      );
    }
    const v = (realPool as any)[prop];
    return typeof v === "function" ? v.bind(realPool) : v;
  },
});

const dbProxy = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    initializeIfPossible();
    if (!realDb) {
      throw new Error(
        "DATABASE_URL must be set before using the database. Set DATABASE_URL and retry.",
      );
    }
    const v = (realDb as any)[prop];
    return typeof v === "function" ? v.bind(realDb) : v;
  },
});

export const pool = poolProxy as unknown as pg.Pool;
export const db = dbProxy as unknown as ReturnType<typeof drizzle>;

export * from "./schema";
