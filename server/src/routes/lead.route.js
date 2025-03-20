import express from "express"
import { getAllLeadsByCampaignController, getAllLeadsController, addLeadController, updateLeadController } from "../controllers/lead.controller.js";

const router = express.Router();

router.get("/", getAllLeadsController);
router.post("/", addLeadController);
router.get("/:id", getAllLeadsByCampaignController)
router.put("/:id", updateLeadController)

export default router;