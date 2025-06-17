import { uploadToGCS } from "../middleware/multer/multer.js";

export async function uploadDocuments(req, res) {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
    }

    try {
      const url = await uploadToGCS(req.file, "customer-uploads");
      // Optionally save to DB
      res.status(201).json({ message: "Uploaded", url });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  } catch (error) {}
}
