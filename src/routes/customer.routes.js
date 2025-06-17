import express from "express";
import { updateCustomerProfile } from "../controllers/cutomer.controller.js";
import { upload, uploadToGCS } from "../middleware/multer/multer.js";
import { uploadDocuments } from "../controllers/upload.controller.js";
// import { localStore } from "../middleware/multer/multer.js";

const router = express.Router();

router.post("/update-profile", updateCustomerProfile);
router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Not logged in",
    });
  }
  const { password, ...safeUserData } = req.user;
  res.json(safeUserData);
});

router.post("/upload", upload.single("file"), uploadDocuments);

export default router;
