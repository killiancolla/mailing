const { getAllLeadsByCampaignService, getAllLeadsService, addLeadService } = require("../services/lead.service")

const getAllLeadsController = async (req, res) => {
    try {
        const leads = await getAllLeadsService()
        res.json(leads)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

const getAllLeadsByCampaignController = async (req, res) => {
    try {
        const { id } = req.params
        const leads = await getAllLeadsByCampaignService(id)
        res.json(leads)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

const addLeadController = async (req, res) => {
    try {
        const { email, prenom, nom, campagne_id } = req.body

        if (!email || !campagne_id) {
            res.status(400).json({ error: "Tous les champs sont requis." })
        }

        const newLeads = await addLeadService(email, prenom, nom, campagne_id);
        res.status(201).json(newLeads)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

module.exports = { getAllLeadsController, getAllLeadsByCampaignController, addLeadController }