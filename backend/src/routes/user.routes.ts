import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/me", requireAuth, getCurrentUser);

export default userRouter;
