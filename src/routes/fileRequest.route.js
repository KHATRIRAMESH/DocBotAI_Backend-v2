import express from "express";
import { submitFileRequest } from "../controllers/filerequest.controller.js";

const router = express.Router();

router.post("/submit-file-request", submitFileRequest);

export default router;
