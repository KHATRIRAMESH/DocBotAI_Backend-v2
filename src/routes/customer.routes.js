import express from "express";
import {
  getCustomersDocuments,
  requestedDocumentsArray,
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

// This route is used to get all documents of a customer by their ID
router.get("/:id/documents", getCustomersDocuments);

router.get("/magic-link/requested-documents", requestedDocumentsArray);

export default router;
