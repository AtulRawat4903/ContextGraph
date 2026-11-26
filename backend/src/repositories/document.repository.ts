import { and, desc, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { documents } from "../db/schema.js";

const documentMetadataColumns = {
  id: documents.id,
  originalFileName: documents.originalFileName,
  mimeType: documents.mimeType,
  fileSizeBytes: documents.fileSizeBytes,
  status: documents.status,
  createdAt: documents.createdAt,
  updatedAt: documents.updatedAt,
};

export async function findOwnedDocumentById(
  documentId: string,
  userId: string,
) {
  const [document] = await db
    .select(documentMetadataColumns)
    .from(documents)
    .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
    .limit(1);

  return document ?? null;
}

export async function findDocumentsByUserId(
  userId: string,
  limit: number,
  offset: number,
) {
  const rows = await db
    .select(documentMetadataColumns)
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt), desc(documents.id))
    .limit(limit + 1)
    .offset(offset);

  return {
    documents: rows.slice(0, limit),
    hasMore: rows.length > limit,
  };
}
