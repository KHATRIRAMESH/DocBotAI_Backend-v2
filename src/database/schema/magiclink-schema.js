import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./user-schema.js";

export const magicLinks = pgTable("magic_links", {
  token: text("token").primaryKey(),
  customerEmail: text("customer_email").notNull(),

  admin: uuid("user")
    .references(() => users.id)
    .notNull(),
  requestedDocuments: text("requested_documents").array(),
  expiresAt: timestamp("expires_at").notNull(),
});
