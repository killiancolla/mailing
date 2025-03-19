import express from "express"
import { createCampaignMailController } from "../controllers/campaignmail.controller.js";

const router = express.Router();

router.post("/", createCampaignMailController);

export default router;