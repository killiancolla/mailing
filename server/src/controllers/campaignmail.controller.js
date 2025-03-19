import { createCampaignMailService } from "../services/campaignmail.service.js";

export const createCampaignMailController = async (req, res) => {
    try {
        const { campagne_id, step, subject, body } = req.body;
        if (!campagne_id || !step || !subject || !body) {
            res.status(400).json({ error: "Tous les champs sont requis." })
        }
        const newCampaign = await createCampaignMailService(campagne_id, step, subject, body);
        res.status(201).json(newCampaign);

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récuperation des campagnes" })
    }
}