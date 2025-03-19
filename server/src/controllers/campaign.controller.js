const { getAllCampaigns, createCampaign, getCampaignByIdService, updateCampaignService } = require("../services/campaign.service");

const getCampaigns = async (req, res) => {
    try {
        const campaigns = await getAllCampaigns();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des campagnes" });
    }
};

const getCampaignByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await getCampaignByIdService(id);
        res.json(campaign);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la récupération de la campagne" });
    }
};

const addCampaign = async (req, res) => {
    try {
        const { nom } = req.body;
        if (!nom) {
            res.status(400).json({ error: "Tous les champs sont requis." })
        }
        const newCampaign = await createCampaign(nom);
        res.status(201).json(newCampaign);

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récuperation des campagnes" })
    }
}

const updateCampaignController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Aucune donnée à mettre à jour." })
        }

        const updatedCampagne = await updateCampaignService(id, data)

        res.json(updatedCampagne)
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la modification de la campagne" })
    }
}

module.exports = { getCampaigns, addCampaign, getCampaignByIdController, updateCampaignController };