import express from "express";
import { sendMagicLink } from "../controllers/generateAndSendMagicLink.controller.js";
import { fetchCustomers } from "../controllers/fetchCustomer.controller.js";
const router = express.Router();

router.post("/send-magic-link", sendMagicLink);
router.get("/customer-list", fetchCustomers);
export default router;
