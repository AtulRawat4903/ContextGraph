import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import { notFound } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
  }),
);
app.use(express.json());

app.use("/api", healthRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
