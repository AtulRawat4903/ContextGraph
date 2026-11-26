import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";

import {
  getDocument,
  listDocuments,
} from "../controllers/document.controller.js";

const documentRouter = Router();

documentRouter.get("/", requireAuth, listDocuments);

documentRouter.get("/:documentId", requireAuth, getDocument);

export default documentRouter;
