const express = require("express");
const { getAllLeadsByCampaignController, getAllLeadsController, addLeadController } = require("../controllers/lead.controller");

const router = express.Router();

router.get("/", getAllLeadsController);
router.post("/", addLeadController);
router.get("/:id", getAllLeadsByCampaignController)

module.exports = router;