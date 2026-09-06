import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";

import { pool } from "./db";
import authRoutes from "./routes/auth";
import foodRoutes from "./routes/Food";

async function initializeDatabase() {
  const schemaPath = path.join(process.cwd(), "server", "schema.sql");
  const schema = await fs.readFile(schemaPath, "utf8");
  await pool.query(schema);
}

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// ROUTES
// =====================================================

// Authentication
app.use("/api/auth", authRoutes);

// Food Listings
app.use("/api/food", foodRoutes);

// =====================================================
// HOME / SERVER CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "ResQMeal backend is running",
  });
});

// =====================================================
// DATABASE HEALTH CHECK
// =====================================================

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "success",
      message: "Backend and PostgreSQL are connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", err);

    res.status(500).json({
      message: "Internal server error",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

const PORT = Number(process.env.PORT || 5000);
const databaseReady = initializeDatabase();

if (process.env.START_SERVER !== "false") {
  databaseReady
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `ResQMeal backend running on http://localhost:${PORT}`
        );
      });
    })
    .catch((error) => {
      console.error("Database initialization failed:", error);
      process.exitCode = 1;
    });
}

export { app, databaseReady };