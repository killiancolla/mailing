const express = require("express");
const { createCampaignMailController } = require("../controllers/campaignmail.controller");

const router = express.Router();

router.post("/", createCampaignMailController);

module.exports = router;