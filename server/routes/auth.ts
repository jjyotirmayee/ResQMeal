import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db";

const router = Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "resqmeal_dev_secret";

// --------------------------------------------------
// Allowed Donor Types
// --------------------------------------------------

const DONOR_TYPES = [
  "Restaurant / Eatery",
  "Hotel / Resort",
  "Catering Service",
  "Grocery / Supermarket",
  "Individual / Household",
];

// --------------------------------------------------
// Allowed NGO Categories
// --------------------------------------------------

const NGO_CATEGORIES = [
  "Food Relief",
  "Community Kitchen",
  "Orphanage / Children Home",
  "Old Age Home",
  "School Nutrition",
  "Slum Outreach",
];

// ==================================================
// REGISTER
// POST /api/auth/register
// ==================================================

router.post(
  "/register",
  async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
      const {
        name,
        email,
        phone,
        password,
        role,

        // Donor fields
        donor_type,
        organization_name,

        // NGO fields
        ngo_category,
        registration_number,
        address,
        daily_meal_capacity,

        // Frontend confirmation fields
        confirmPassword,
        termsAccepted,
      } = req.body;

      // ----------------------------------------------
      // Basic validation
      // ----------------------------------------------

      if (!name || !email || !phone || !password || !role) {
        return res.status(400).json({
          message:
            "Name, email, phone, password and role are required",
        });
      }

      // ----------------------------------------------
      // Normalize values
      // ----------------------------------------------

      const normalizedEmail = String(email)
        .trim()
        .toLowerCase();

      const normalizedRole = String(role)
        .trim()
        .toUpperCase();

      // ----------------------------------------------
      // Password validation
      // ----------------------------------------------

      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters",
        });
      }

      if (
        confirmPassword !== undefined &&
        password !== confirmPassword
      ) {
        return res.status(400).json({
          message: "Passwords do not match",
        });
      }

      // ----------------------------------------------
      // Terms validation
      // ----------------------------------------------

      if (termsAccepted === false) {
        return res.status(400).json({
          message:
            "You must accept the terms and conditions",
        });
      }

      // ----------------------------------------------
      // Only Donor and NGO can register publicly
      // ----------------------------------------------

      if (!["DONOR", "NGO"].includes(normalizedRole)) {
        return res.status(400).json({
          message:
            "Only DONOR and NGO registration is allowed",
        });
      }

      // ----------------------------------------------
      // Check duplicate email
      // ----------------------------------------------

      const existingUser = await client.query(
        `SELECT id
         FROM users
         WHERE LOWER(email) = $1`,
        [normalizedEmail]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      // ----------------------------------------------
      // Donor validation
      // ----------------------------------------------

      if (normalizedRole === "DONOR") {
        if (!donor_type) {
          return res.status(400).json({
            message: "Donor type is required",
          });
        }

        if (!DONOR_TYPES.includes(donor_type)) {
          return res.status(400).json({
            message: "Invalid donor type",
          });
        }

        if (!address) {
          return res.status(400).json({
            message: "Address is required",
          });
        }
      }

      // ----------------------------------------------
      // NGO validation
      // ----------------------------------------------

      if (normalizedRole === "NGO") {
        if (!ngo_category) {
          return res.status(400).json({
            message: "NGO category is required",
          });
        }

        if (!NGO_CATEGORIES.includes(ngo_category)) {
          return res.status(400).json({
            message: "Invalid NGO category",
          });
        }

        if (!registration_number) {
          return res.status(400).json({
            message: "Registration number is required",
          });
        }

        if (!address) {
          return res.status(400).json({
            message: "Address is required",
          });
        }

        if (
          daily_meal_capacity === undefined ||
          daily_meal_capacity === null ||
          Number(daily_meal_capacity) <= 0
        ) {
          return res.status(400).json({
            message:
              "Daily meal capacity must be greater than 0",
          });
        }
      }

      // ----------------------------------------------
      // Hash password
      // ----------------------------------------------

      const passwordHash = await bcrypt.hash(password, 10);

      // ----------------------------------------------
      // Start transaction
      // ----------------------------------------------

      await client.query("BEGIN");

      // ----------------------------------------------
      // Create user
      // ----------------------------------------------

      const userResult = await client.query(
        `INSERT INTO users
          (
            name,
            email,
            password_hash,
            phone,
            role
          )
         VALUES
          ($1, $2, $3, $4, $5)
         RETURNING
          id,
          name,
          email,
          phone,
          role,
          status,
          created_at`,
        [
          String(name).trim(),
          normalizedEmail,
          passwordHash,
          String(phone).trim(),
          normalizedRole,
        ]
      );

      const user = userResult.rows[0];

      // ----------------------------------------------
      // Create donor profile
      // ----------------------------------------------

      if (normalizedRole === "DONOR") {
        await client.query(
          `INSERT INTO donor_profiles
            (
              user_id,
              organization_name,
              donor_type,
              address
            )
           VALUES
            ($1, $2, $3, $4)`,
          [
            user.id,
            organization_name
              ? String(organization_name).trim()
              : null,
            donor_type,
            String(address).trim(),
          ]
        );
      }

      // ----------------------------------------------
      // Create NGO profile
      // ----------------------------------------------

      if (normalizedRole === "NGO") {
        await client.query(
          `INSERT INTO ngo_profiles
            (
              user_id,
              organization_name,
              ngo_category,
              registration_number,
              address,
              daily_meal_capacity,
              is_verified
            )
           VALUES
            ($1, $2, $3, $4, $5, $6, $7)`,
          [
            user.id,
            String(name).trim(),
            ngo_category,
            String(registration_number).trim(),
            String(address).trim(),
            Number(daily_meal_capacity),
            false,
          ]
        );
      }

      // ----------------------------------------------
      // Commit transaction
      // ----------------------------------------------

      await client.query("COMMIT");

      // ----------------------------------------------
      // Generate JWT
      // ----------------------------------------------

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // ----------------------------------------------
      // Response
      // ----------------------------------------------

      return res.status(201).json({
        message:
          normalizedRole === "NGO"
            ? "NGO registration submitted successfully"
            : "Donor registration successful",

        token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },

        ...(normalizedRole === "NGO" && {
          verification: {
            isVerified: false,
            message:
              "Your NGO account is pending verification",
          },
        }),
      });
    } catch (error) {
      await client.query("ROLLBACK");

      console.error(
        "Registration error:",
        error
      );

      return res.status(500).json({
        message: "Registration failed",
      });
    } finally {
      client.release();
    }
  }
);

// ==================================================
// LOGIN
// POST /api/auth/login
// ==================================================

router.post(
  "/login",
  async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;

      // ----------------------------------------------
      // Validation
      // ----------------------------------------------

      if (!email || !password) {
        return res.status(400).json({
          message:
            "Email and password are required",
        });
      }

      const normalizedEmail = String(email)
        .trim()
        .toLowerCase();

      // ----------------------------------------------
      // Find user
      // ----------------------------------------------

      const result = await pool.query(
        `SELECT
          id,
          name,
          email,
          password_hash,
          phone,
          role,
          status
         FROM users
         WHERE LOWER(email) = $1`,
        [normalizedEmail]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      const user = result.rows[0];

      // ----------------------------------------------
      // Check account status
      // ----------------------------------------------

      if (user.status === "SUSPENDED") {
        return res.status(403).json({
          message:
            "Your account has been suspended",
        });
      }

      // ----------------------------------------------
      // Check selected role
      // ----------------------------------------------

      if (role) {
        const requestedRole = String(role)
          .trim()
          .toUpperCase();

        if (requestedRole !== user.role) {
          return res.status(403).json({
            message:
              `This account is registered as ${user.role}`,
          });
        }
      }

      // ----------------------------------------------
      // Compare password
      // ----------------------------------------------

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password_hash
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      // ----------------------------------------------
      // Load profile
      // ----------------------------------------------

      let profile = null;

      if (user.role === "DONOR") {
        const donorResult =
          await pool.query(
            `SELECT
              id,
              organization_name,
              donor_type,
              address,
              city,
              created_at
             FROM donor_profiles
             WHERE user_id = $1`,
            [user.id]
          );

        if (donorResult.rows.length > 0) {
          profile = donorResult.rows[0];
        }
      }

      if (user.role === "NGO") {
        const ngoResult =
          await pool.query(
            `SELECT
              id,
              organization_name,
              ngo_category,
              registration_number,
              address,
              city,
              daily_meal_capacity,
              is_verified,
              created_at
             FROM ngo_profiles
             WHERE user_id = $1`,
            [user.id]
          );

        if (ngoResult.rows.length > 0) {
          profile = ngoResult.rows[0];
        }
      }

      // ----------------------------------------------
      // Generate JWT
      // ----------------------------------------------

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // ----------------------------------------------
      // Login response
      // ----------------------------------------------

      return res.status(200).json({
        message: "Login successful",

        token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },

        profile,

        ...(user.role === "NGO" &&
          profile && {
            verification: {
              isVerified:
                profile.is_verified,
              message:
                profile.is_verified
                  ? "NGO account is verified"
                  : "NGO account is pending verification",
            },
          }),
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        message: "Login failed",
      });
    }
  }
);

// ==================================================
// CURRENT USER
// GET /api/auth/me
// ==================================================

router.get(
  "/me",
  async (req: Request, res: Response) => {
    try {
      const authHeader =
        req.headers.authorization;

      if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
      ) {
        return res.status(401).json({
          message:
            "Authentication token required",
        });
      }

      const token =
        authHeader.substring(7);

      const decoded = jwt.verify(
        token,
        JWT_SECRET
      ) as {
        id: number;
        email: string;
        role: string;
      };

      const result = await pool.query(
        `SELECT
          id,
          name,
          email,
          phone,
          role,
          status,
          created_at
         FROM users
         WHERE id = $1`,
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        user: result.rows[0],
      });
    } catch {
      return res.status(401).json({
        message:
          "Invalid or expired token",
      });
    }
  }
);

// ==================================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ==================================================

router.post(
  "/forgot-password",
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // ----------------------------------------
      // Validation
      // ----------------------------------------

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const normalizedEmail = String(email)
        .trim()
        .toLowerCase();

      // ----------------------------------------
      // Find user by email
      // ----------------------------------------

      const result = await pool.query(
        `SELECT
          id,
          email,
          name,
          role
         FROM users
         WHERE LOWER(email) = $1`,
        [normalizedEmail]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Email not found",
        });
      }

      const user = result.rows[0];

      // ----------------------------------------
      // Response
      // ----------------------------------------

      return res.status(200).json({
        message: "Email verified. Proceed to reset password.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to process password reset request",
      });
    }
  }
);

// ==================================================
// RESET PASSWORD
// POST /api/auth/reset-password
// ==================================================

router.post(
  "/reset-password",
  async (req: Request, res: Response) => {
    try {
      const {
        email,
        newPassword,
        confirmPassword,
      } = req.body;

      // ----------------------------------------
      // Validation
      // ----------------------------------------

      if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message:
            "Email, password, and password confirmation are required",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: "Passwords do not match",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters",
        });
      }

      const normalizedEmail = String(email)
        .trim()
        .toLowerCase();

      // ----------------------------------------
      // Find user by email
      // ----------------------------------------

      const result = await pool.query(
        `SELECT
          id,
          email,
          role
         FROM users
         WHERE LOWER(email) = $1`,
        [normalizedEmail]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Email not found",
        });
      }

      const user = result.rows[0];

      // ----------------------------------------
      // Hash new password
      // ----------------------------------------

      const passwordHash =
        await bcrypt.hash(newPassword, 10);

      // ----------------------------------------
      // Update password in database
      // ----------------------------------------

      await pool.query(
        `UPDATE users
         SET password_hash = $1
         WHERE id = $2`,
        [passwordHash, user.id]
      );

      // ----------------------------------------
      // Response
      // ----------------------------------------

      return res.status(200).json({
        message: "Password reset successful",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      return res.status(500).json({
        message: "Failed to reset password",
      });
    }
  }
);

export default router;