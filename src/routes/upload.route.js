// routes/upload.route.js
import express from "express";
import { upload, uploadToGCS } from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const url = await uploadToGCS(req.file, "customer-uploads");
    // Optionally save to DB
    res.status(201).json({ message: "Uploaded", url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
