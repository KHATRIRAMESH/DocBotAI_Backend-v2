import { jsonb, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { customers } from "./customer-schema";
import { users } from "./user-schema";

export const documentRequests = pgTable("document_requests", {
  id: uuid("id").primaryKey(),
  senderId: uuid("sender_id")
    .references(() => users.id)
    .notNull(),
  receiverId: uuid("receiver_id")
    .references(() => customers.id)
    .notNull(),
  filesToRequest: jsonb("files_to_request").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
