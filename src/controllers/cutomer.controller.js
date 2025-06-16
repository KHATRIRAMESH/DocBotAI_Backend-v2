import { eq } from "drizzle-orm";
import { db } from "../database/connection/dbConnection.js";
import { customers } from "../database/schema/customer-schema.js";

export async function updateCustomerProfile(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .returning();
    if (existingCustomer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const updatedCustomer = await db
      .update(customers)
      .set({ password: password })
      .where(eq(customers.email, email))
      .returning();
    // const insertedCustomer = await db
    //   .insert(customers)
    //   .values({
    //     email: email,
    //     password: password,
    //   })
    //   .returning({ email: customers.email });
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
      data: updatedCustomer[0], // Assuming the first element is the updated customer
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update customer profile.",
    });
  }
}
