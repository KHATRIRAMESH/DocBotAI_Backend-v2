import express from "express";
import { updateCustomerProfile } from "../controllers/cutomer.controller.js";

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

export default router;
