import express from "express";
import pool from "../config/db.js";
const router = express.Router();

router.get('/', async(req, res) => {
    console.log(req)
    try {
        const result = await pool.query(
            "SELECT * FROM questions ORDER BY RANDOM() LIMIT 10"
          );
        if (result.rows.length === 0) {
        return res.status(200).json({ message: "Questions unavailable in the database." });
        }

        res.json(result.rows)
      
    } catch(error) {
        console.error("Failed to fetch questions: ", error);
        res.status(500).json({error: "Failed to fetch questions."})
      }
})

export default router