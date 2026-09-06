import "dotenv/config";
import { Pool } from "pg";
import { newDb } from "pg-mem";

const pool = process.env.USE_IN_MEMORY_DB === "true"
  ? new (newDb().adapters.createPg().Pool)()
  : new Pool({ connectionString: process.env.DATABASE_URL });

export { pool };