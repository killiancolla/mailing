const express = require("express");
const { getCampaigns, addCampaign, getCampaignByIdController, updateCampaignController } = require("../controllers/campaign.controller");

const router = express.Router();

router.get("/", getCampaigns);
router.get("/:id", getCampaignByIdController)
router.post("/", addCampaign);
router.put("/:id", updateCampaignController)

module.exports = router;