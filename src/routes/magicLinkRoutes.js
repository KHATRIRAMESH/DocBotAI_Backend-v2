import express from "express";
import { sendMagicLink } from "../controllers/generateAndSendMagicLink.controller.js";
const router = express.Router();

router.post("/send-magic-link", sendMagicLink);
export default router;
