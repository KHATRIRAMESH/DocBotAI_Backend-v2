import express from "express";
import {
  getCustomersDocuments,
  updateCustomerProfile,
} from "../controllers/cutomer.controller.js";
import { localStore } from "../middleware/multer/multer.middleware.js";
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

router.post("/upload", localStore.any(), uploadDocuments);
router.get("/:id/documents", getCustomersDocuments);

export default router;
