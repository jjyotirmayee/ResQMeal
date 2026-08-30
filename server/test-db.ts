import { pool } from "./db";

async function testDatabase() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully!");
    console.log("Database time:", result.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await pool.end();
  }
}

testDatabase();