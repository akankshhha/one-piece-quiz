import express from "express";
import pool from "../config/db.js";
const router = express.Router();

//GET API: Fetch all scores
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM scores ORDER BY time_taken"
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No scores available." });
    }

    res.json(result.rows);
  } catch {
    console.error("Failed to fetch records.");
    res.status(500).json({error: "Failed to fetch records."})
  }
});

//POST API: Post the score
router.post('/', async (req, res) => {
    const { username, score, time_taken } = req.body
   
    if(!username || typeof score !== 'number' || typeof time_taken !== 'number' || username.length < 3) {
        return res.status(400).json({error: "Invalid input data!"})
    }

    try {
        const result = await pool.query("INSERT INTO scores(username, score, time_taken) VALUES ($1, $2, $3) returning *",
        [username, score, time_taken])
        res.status(201).json(result.rows[0])
    } catch {
      console.error("Failed to upload score.")
      res.status(500).json({error: "Failed to upload score!"})
    }
})

export default router

