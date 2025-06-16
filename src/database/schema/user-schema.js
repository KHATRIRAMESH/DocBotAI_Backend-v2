import { eq } from "drizzle-orm";
import { PgRole, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email"), // nullable
    password: text("password"),
    role: text("role").default("user"),
    provider: text("provider").default("local"),
    providerId: text("providerId"),
  },
  (users) => ({
    uniqueEmailLocal: unique("unique_local_email").on(
      users.email,
      users.provider
    ),
    uniqueProviderId: unique("unique_provider_id").on(
      users.provider,
      users.providerId
    ),
  })
);
