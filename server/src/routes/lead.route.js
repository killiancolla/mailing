import express from "express"
import { getAllLeadsByCampaignController, getAllLeadsController, addLeadController } from "../controllers/lead.controller.js";

const router = express.Router();

router.get("/", getAllLeadsController);
router.post("/", addLeadController);
router.get("/:id", getAllLeadsByCampaignController)

export default router;