import express from "express"
import { track_open } from "../controllers/mail.controller.js";

const router = express.Router();

router.get("/track-open/:mail_id", track_open)

export default router;