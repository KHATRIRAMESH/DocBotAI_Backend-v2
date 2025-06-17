import fs from "fs/promises";
import { uploadToCloudinary } from "../services/uploadToCloudinary.service.js";
import { uplodedDocuments } from "../database/schema/document-schema.js";
import { db } from "../database/connection/dbConnection.js";

export async function uploadDocuments(req, res) {
  const uploader = req.user;
  try {
    const files = req.files;
    // console.log("files:", files);
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
    }
    const file = files[0];

    console.log(file);

    const fileBuffer = await fs.readFile(file.path);
    const result = await uploadToCloudinary(
      fileBuffer,
      file.mimetype,
      file.originalname
    );

    const [insertedDocument] = await db
      .insert(uplodedDocuments)
      .values({
        uploader: uploader.id,
        fileUrl: result.secure_url,
        fileName: result.original_filename,
        fileType: result.resource_type,
        fileSize: result.bytes,
      })
      .returning();

    console.log("Uploaded to Cloudinary:", result);
    res.status(201).json({ message: "Uploaded", insertedDocument });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}
