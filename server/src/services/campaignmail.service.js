const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createCampaignMailService = async (campagne_id, step, subject, body) => {
    try {
        const newCampaign = await prisma.campagneMail.create({
            data: {
                campagne_id: parseInt(campagne_id), step: parseInt(step), subject, body
            },
        });
        return newCampaign;
    } catch (error) {
        throw new Error('Erreur lors de la création de la campagne');
    }
};

module.exports = { createCampaignMailService };