import { sql } from "drizzle-orm";

import {
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  integer,
  text,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

export const documentStatusEnum = pgEnum("document_status", [
  "queued",
  "processing",
  "completed",
  "failed",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    originalFileName: varchar("original_file_name", {
      length: 255,
    }).notNull(),

    mimeType: varchar("mime_type", { length: 100 }).notNull(),

    fileSizeBytes: integer("file_size_bytes").notNull(),

    storageKey: varchar("storage_key", {
      length: 512,
    })
      .notNull()
      .unique(),

    status: documentStatusEnum().notNull().default("queued"),

    errorMessage: text("error_message"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("documents_user_id_idx").on(table.userId),

    check("documents_file_size_positive", sql`${table.fileSizeBytes} > 0`),
  ],
);

export const documentChunks = pgTable(
  "document_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, {
        onDelete: "cascade",
      }),

    chunkIndex: integer("chunk_index").notNull(),

    content: text("content").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("document_chunks_document_index_unique").on(
      table.documentId,
      table.chunkIndex,
    ),

    check("document_chunks_index_nonnegative", sql`${table.chunkIndex} >= 0`),
  ],
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    title: varchar("title", { length: 255 }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("conversations_user_id_idx").on(table.userId)],
);

export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, {
        onDelete: "cascade",
      }),

    role: messageRoleEnum("role").notNull(),

    content: text("content").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("messages_conversation_id_idx").on(table.conversationId)],
);

export const messageSources = pgTable(
  "message_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, {
        onDelete: "cascade",
      }),

    chunkId: uuid("chunk_id")
      .notNull()
      .references(() => documentChunks.id, {
        onDelete: "cascade",
      }),

    citationOrder: integer("citation_order").notNull(),
  },
  (table) => [
    uniqueIndex("message_sources_message_chunk_unique").on(
      table.messageId,
      table.chunkId,
    ),

    uniqueIndex("message_sources_message_order_unique").on(
      table.messageId,
      table.citationOrder,
    ),

    index("message_sources_chunk_id_idx").on(table.chunkId),

    check("message_sources_order_positive", sql`${table.citationOrder} > 0`),
  ],
);
