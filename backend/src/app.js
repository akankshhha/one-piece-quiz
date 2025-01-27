import express from "express";
import bodyParser from "body-parser";
import scoresRoutes from "./routes/scoreBoard.js";
import cors from "cors"

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/scores", scoresRoutes);

export default app; // Export the app
