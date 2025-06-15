import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user-schema.js";

export const customerStatusEnum = pgEnum("status", [
  "active",
  "inactive",
  "suspended",
]);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),

  email: text("email").notNull().unique(),
  password: text("password"),
  admin: uuid("users")
    .references(() => users.id)
    .notNull(),
  status: customerStatusEnum("status").default("active"), // 'active', 'inactive', 'suspended'
  createdAt: timestamp("created_at").defaultNow(),
});
