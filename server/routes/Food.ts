import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

// ==================================================
// CREATE FOOD LISTING
// POST /api/food
// ==================================================

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      donor_id,
      food_item,
      category,
      quantity,
      unit,
      description,
      allergens,
      food_photo,
      location,
      pickup_start,
      pickup_end,
      expires_at,
    } = req.body;

    // --------------------------------------------------
    // VALIDATE REQUIRED FIELDS
    // --------------------------------------------------

    if (
      !donor_id ||
      !food_item ||
      !category ||
      !quantity ||
      !unit ||
      !location ||
      !expires_at
    ) {
      return res.status(400).json({
        message: "Please fill all required food listing fields",
      });
    }

    // --------------------------------------------------
    // VALIDATE QUANTITY
    // --------------------------------------------------

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // --------------------------------------------------
    // VERIFY DONOR PROFILE
    // donor_id refers to donor_profiles.id
    // --------------------------------------------------

    const donorResult = await pool.query(
      `
      SELECT
        id,
        user_id,
        organization_name,
        donor_type
      FROM donor_profiles
      WHERE id = $1
      `,
      [donor_id]
    );

    if (donorResult.rows.length === 0) {
      return res.status(403).json({
        message: "Invalid donor",
      });
    }

    // --------------------------------------------------
    // INSERT FOOD LISTING
    // --------------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO food_listings
      (
        donor_id,
        food_item,
        category,
        quantity,
        unit,
        description,
        allergens,
        food_photo,
        location,
        pickup_start,
        pickup_end,
        status,
        expires_at
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        'AVAILABLE',
        $12
      )
      RETURNING *
      `,
      [
        donor_id,
        String(food_item).trim(),
        String(category).trim(),
        Number(quantity),
        String(unit).trim(),
        description ? String(description).trim() : null,
        allergens ? String(allergens).trim() : null,
        food_photo ? String(food_photo).trim() : null,
        String(location).trim(),
        pickup_start || null,
        pickup_end || null,
        expires_at,
      ]
    );

    // --------------------------------------------------
    // SUCCESS RESPONSE
    // --------------------------------------------------

    return res.status(201).json({
      message: "Food listing created successfully",
      food: result.rows[0],
    });
  } catch (error) {
    console.error("Create food listing error:", error);

    return res.status(500).json({
      message: "Failed to create food listing",
    });
  }
});


// ==================================================
// GET MY FOOD LISTINGS
// GET /api/food/my?user_id=8
// ==================================================

router.get("/my", async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;

    // --------------------------------------------------
    // VALIDATE USER ID
    // --------------------------------------------------

    if (!user_id) {
      return res.status(400).json({
        message: "user_id is required",
      });
    }

    // --------------------------------------------------
    // GET FOOD LISTINGS BELONGING TO THIS USER
    // --------------------------------------------------

    const result = await pool.query(
      `
      SELECT
        f.id,
        f.donor_id,
        f.food_item,
        f.category,
        f.quantity,
        f.unit,
        f.description,
        f.allergens,
        f.food_photo,
        f.location,
        f.pickup_start,
        f.pickup_end,
        f.status,
        f.posted_at,
        f.expires_at,
        d.organization_name,
        d.donor_type
      FROM food_listings f
      JOIN donor_profiles d
        ON f.donor_id = d.id
      WHERE d.user_id = $1
      ORDER BY f.posted_at DESC
      `,
      [user_id]
    );

    // --------------------------------------------------
    // SUCCESS RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      foods: result.rows,
    });
  } catch (error) {
    console.error("Get donor food listings error:", error);

    return res.status(500).json({
      message: "Failed to fetch donor food listings",
    });
  }
});


// ==================================================
// GET ALL AVAILABLE FOOD
// GET /api/food
// ==================================================

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT
        f.id,
        f.donor_id,
        f.food_item,
        f.category,
        f.quantity,
        f.unit,
        f.description,
        f.allergens,
        f.food_photo,
        f.location,
        f.pickup_start,
        f.pickup_end,
        f.status,
        f.posted_at,
        f.expires_at,
        d.organization_name,
        d.donor_type
      FROM food_listings f
      JOIN donor_profiles d
        ON f.donor_id = d.id
      WHERE f.status = 'AVAILABLE'
      ORDER BY f.posted_at DESC
      `
    );

    return res.status(200).json({
      foods: result.rows,
    });
  } catch (error) {
    console.error("Get food listings error:", error);

    return res.status(500).json({
      message: "Failed to fetch food listings",
    });
  }
});


// ==================================================
// GET SINGLE FOOD LISTING
// GET /api/food/:id
// ==================================================

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        f.id,
        f.donor_id,
        f.food_item,
        f.category,
        f.quantity,
        f.unit,
        f.description,
        f.allergens,
        f.food_photo,
        f.location,
        f.pickup_start,
        f.pickup_end,
        f.status,
        f.posted_at,
        f.expires_at,
        d.organization_name,
        d.donor_type
      FROM food_listings f
      JOIN donor_profiles d
        ON f.donor_id = d.id
      WHERE f.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Food listing not found",
      });
    }

    return res.status(200).json({
      food: result.rows[0],
    });
  } catch (error) {
    console.error("Get food listing error:", error);

    return res.status(500).json({
      message: "Failed to fetch food listing",
    });
  }
});


export default router;