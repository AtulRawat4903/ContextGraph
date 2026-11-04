import express from "express";
import cors from "cors";
import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ContextGraph API is running",
  });
});

app.listen(env.PORT, () => {
  console.log(`ContextGraph API running on port ${env.PORT}`);
});