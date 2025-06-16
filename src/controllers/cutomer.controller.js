import { eq } from "drizzle-orm";
import { db } from "../database/connection/dbConnection.js";
import { customers } from "../database/schema/customer-schema.js";

export async function updateCustomerProfile(req, res) {
  //   if (!req.isAuthenticated()) {
  //     return res.status(401).json({
  //       success: false,
  //       message: "You must be logged in to update your profile.",
  //     });
  //   }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }
    // await db
    //   .update(customers)
    //   .set({ password: password })
    //   .where(eq(customers.email, email));
    await db.insert(customers).values({
      email: email,
      password: password,
    });
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update customer profile.",
    });
  }
}
