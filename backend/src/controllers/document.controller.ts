import type { RequestHandler } from "express";
import { z } from "zod";

import { findOwnedDocumentById } from "../repositories/document.repository.js";

const documentIdSchema = z.uuid();

export const getDocument: RequestHandler = async (req, res) => {
  const parsedId = documentIdSchema.safeParse(req.params.documentId);

  if (!parsedId.success) {
    res.status(400).json({
      success: false,
      message: "Invalid document ID",
    });
    return;
  }

  const userId = res.locals.authUserId as string;

  const document = await findOwnedDocumentById(parsedId.data, userId);

  if (!document) {
    res.status(404).json({
      success: false,
      message: "Document not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    document,
  });
};
