import "dotenv/config.js";
import crypto from "crypto";
import { magicLinks } from "../database/schema/magiclink-schema.js";
import { emailService } from "./email.service.js";
import { db } from "../database/connection/dbConnection.js";

export const generateAndSendMagicLink = async (customerEmail, adminId) => {
  if (!customerEmail || !adminId) {
    console.error("Missing customer email or admin ID.");
    throw new Error("Email and admin ID are required.");
  }

  try {
    // 1. Generate token and expiration
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    console.log("Generated token:", token);

    // 2. Store magic link in DB
    await db.insert(magicLinks).values({
      token,
      customerEmail,
      admin: adminId,
      expiresAt,
    });

    console.log("Magic link inserted into database for:", customerEmail);

    // 3. Build magic link URL
    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) {
      throw new Error("BACKEND_URL is not defined in environment variables.");
    }

    const magicLink = `${baseUrl}/auth/magic/callback?token=${token}&admin=${adminId}`;
    console.log("Generated magic link:", magicLink);

    // 4. Send email
    await emailService(magicLink, customerEmail, expiresAt);
    console.log("Magic link email sent to:", customerEmail);
  } catch (error) {
    console.error("Error in generateAndSendMagicLink:", error.message);
    throw new Error("Failed to generate and send magic link.");
  }
};
