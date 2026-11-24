import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import { notFound } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import userRouter from "./routes/user.routes.js";
import documentRouter from "./routes/document.routes.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api", healthRoutes);

app.use("/api", userRouter);

app.use("/api/documents", documentRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
