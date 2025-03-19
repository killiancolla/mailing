const { getAllSettings } = require("../services/setting.service")

const getSettings = async (req, res) => {
    try {
        const settings = await getAllSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des paramètres" });
    }
};

module.exports = { getSettings };