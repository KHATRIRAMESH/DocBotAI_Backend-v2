import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { customers } from "./customer-schema.js";

export const uplodedDocuments = pgTable("uploaded_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  uploader: uuid("uploader").references(() => customers.id),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
