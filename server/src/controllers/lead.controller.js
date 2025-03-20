import { getAllLeadsByCampaignService, getAllLeadsService, addLeadService, updateLeadService } from "../services/lead.service.js"

export const getAllLeadsController = async (req, res) => {
    try {
        const leads = await getAllLeadsService()
        res.json(leads)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

export const getAllLeadsByCampaignController = async (req, res) => {
    try {
        const { id } = req.params
        const leads = await getAllLeadsByCampaignService(id)
        res.json(leads)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

export const addLeadController = async (req, res) => {
    try {
        const { email, prenom, nom, ville, website, campagne_id } = req.body

        if (!email || !campagne_id) {
            res.status(400).json({ error: "Tous les champs sont requis." })
        }

        const newLeads = await addLeadService(email, prenom, nom, ville, website, campagne_id);
        res.status(201).json(newLeads)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

export const updateLeadController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Aucune donnée à mettre à jour." })
        }

        const updatedLead = await updateLeadService(id, data)

        res.json(updatedLead)
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la modification du lead" })
    }
}