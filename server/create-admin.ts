import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "./db";

const adminName = process.env.ADMIN_NAME;
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPhone = process.env.ADMIN_PHONE;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminName || !adminEmail || !adminPhone || !adminPassword) {
  throw new Error(
    "Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, and ADMIN_PASSWORD before running the admin provisioning command."
  );
}

if (adminPassword.length < 8) {
  throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
}

try {
  const existing = await pool.query(
    "SELECT id, email, role FROM users WHERE LOWER(email) = $1",
    [adminEmail]
  );

  if (existing.rows.length > 0) {
    throw new Error(`An account already exists for ${adminEmail}. No changes were made.`);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, phone, role)
     VALUES ($1, $2, $3, $4, 'ADMIN')
     RETURNING id, name, email, role, status`,
    [adminName.trim(), adminEmail, passwordHash, adminPhone.trim()]
  );

  console.table(result.rows);
  console.log("Admin account created successfully.");
} finally {
  await pool.end();
}
