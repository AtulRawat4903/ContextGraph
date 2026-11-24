import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { documents } from "../db/schema.js";

export async function findOwnedDocumentById(
  documentId: string,
  userId: string,
) {
  const [document] = await db
    .select({
      id: documents.id,
      originalFileName: documents.originalFileName,
      mimeType: documents.mimeType,
      fileSizeBytes: documents.fileSizeBytes,
      status: documents.status,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
    .limit(1);

  return document ?? null;
}
