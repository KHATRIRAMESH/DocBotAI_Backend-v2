import { eq } from "drizzle-orm";
import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email"), // nullable
    password: text("password"),
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
