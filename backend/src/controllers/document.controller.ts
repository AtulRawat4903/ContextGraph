import type { RequestHandler } from "express";
import { z } from "zod";
import { getAuthenticatedUserId } from "../utils/auth-context.js";

import {
  findOwnedDocumentById,
  findDocumentsByUserId,
} from "../repositories/document.repository.js";

import { listDocumentsQuerySchema } from "../schemas/document.schema.js";

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

  const userId = getAuthenticatedUserId(res.locals);

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

export const listDocuments: RequestHandler = async (req, res) => {
  const parsedQuery = listDocumentsQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    res.status(400).json({
      success: false,
      message: "Invalid pagination parameters",
    });
    return;
  }

  const userId = getAuthenticatedUserId(res.locals);

  const { limit, offset } = parsedQuery.data;

  const result = await findDocumentsByUserId(userId, limit, offset);

  res.status(200).json({
    success: true,
    documents: result.documents,
    pagination: {
      limit,
      offset,
      hasMore: result.hasMore,
    },
  });
};
