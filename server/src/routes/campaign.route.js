import express from "express"

import { getCampaigns, addCampaign, getCampaignByIdController, updateCampaignController } from "../controllers/campaign.controller.js";

const router = express.Router();

router.get("/", getCampaigns);
router.get("/:id", getCampaignByIdController)
router.post("/", addCampaign);
router.put("/:id", updateCampaignController)

export default router; 