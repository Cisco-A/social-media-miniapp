import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";

import connectDB from "./config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";
import commentsRoutes from "./modules/comments/comments.routes.js";

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);


const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/comments", commentsRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
