import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user-schema.js";

export const customerStatusEnum = pgEnum("status", [
  "active",
  "inactive",
  "suspended",
]);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password"),
  role: text("role").default("customer"), // 'customer', 'admin', 'support'
  admin: uuid("users")
    .references(() => users.id)
    .notNull(),
  fileUrls: jsonb("file_urls"),
  status: customerStatusEnum("status").default("active"), // 'active', 'inactive', 'suspended'
  createdAt: timestamp("created_at").defaultNow(),
});
