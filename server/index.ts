import express from "express";
import cors from "cors";
import { pool } from "./db";
import authRoutes from "./routes/auth";

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// AUTH ROUTES
// ===============================

app.use("/api/auth", authRoutes);

// ===============================
// HOME / SERVER CHECK
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "ResQMeal backend is running",
  });
});

// ===============================
// DATABASE HEALTH CHECK
// ===============================

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

// ===============================
// ERROR HANDLER
// ===============================

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

// ===============================
// START SERVER
// ===============================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`ResQMeal backend running on http://localhost:${PORT}`);
});