import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../schema/index.js";
import "dotenv/config.js";

console.log("Connecting to Neon database...");
const database_url = process.env.NEON_DATABASE_URL;

const sql = neon(database_url);
// Create drizzle instance
if (!database_url) {
  throw new Error("NEON_DATABASE_URL environment variable is not set");
}
export const db = drizzle(sql, { schema });
