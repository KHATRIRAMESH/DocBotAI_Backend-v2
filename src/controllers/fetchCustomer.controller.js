import { eq } from "drizzle-orm";
import { db } from "../database/connection/dbConnection.js";
import { customers } from "../database/schema/customer-schema.js";

export async function fetchCustomers(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const adminUser = req.user;
    const adminId = adminUser.id; // Ensure admin is logged in

    const customersList = await db
      .select()
      .from(customers)
      .where(eq(customers.admin, adminId));

    if (customersList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No customers found for this admin.",
      });
    }
    res.status(200).json({
      success: true,
      data: customersList,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}
