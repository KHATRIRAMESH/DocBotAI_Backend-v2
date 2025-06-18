import { eq } from "drizzle-orm";
import { db } from "../database/connection/dbConnection.js";
import { customers } from "../database/schema/customer-schema.js";
import { uploadedDocuments } from "../database/schema/document-schema.js";
import { magicLinks } from "../database/schema/magiclink-schema.js";

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
      .where(eq(customers.email, email));

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

export async function getCustomersDocuments(req, res) {
  try {
    const customerId = req.params.id;
    console.log(customerId);
    const documents = await db
      .select()
      .from(uploadedDocuments)
      .where(eq(uploadedDocuments.uploader, customerId));
    console.log(documents);
    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.log("Error fetching documents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents.",
    });
  }
}

export async function requestedDocumentsArray(req, res) {
  const requester = req.user;
  const email = requester.email;

  try {
    const [requestedDocuments] = await db
      .select()
      .from(magicLinks)
      .where(eq(magicLinks.customerEmail, email));
    if (requestedDocuments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No requested documents found for this customer.",
      });
    }
    res.status(200).json({
      success: true,
      data: requestedDocuments.requestedDocuments,
    });
  } catch (error) {
    console.log("Error fetching requested documents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch requested documents.",
    });
  }
}
