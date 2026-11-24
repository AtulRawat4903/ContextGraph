import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { getDocument } from "../controllers/document.controller.js";

const documentRouter = Router();

documentRouter.get("/:documentId", requireAuth, getDocument);

export default documentRouter;
