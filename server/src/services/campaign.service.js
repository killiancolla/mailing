const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllCampaigns = async () => {
    return await prisma.campagne.findMany();
};

const getCampaignByIdService = async (id) => {
    return await prisma.campagne.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            Lead: true,
            CampagneMail: true,
            Mail: true
        }
    });
};

const createCampaign = async (nom) => {
    try {
        const newCampaign = await prisma.campagne.create({
            data: {
                nom
            },
        });
        return newCampaign;
    } catch (error) {
        throw new Error('Erreur lors de la création de la campagne');
    }
};

const updateCampaignService = async (id, data) => {
    try {
        const newCampaign = await prisma.campagne.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!newCampaign)
            return null;

        return await prisma.campagne.update({
            where: {
                id: parseInt(id)
            },
            data: data
        });

    } catch (error) {
        throw new Error('Erreur lors de la modification de la campagne');
    }
};

module.exports = { getAllCampaigns, createCampaign, getCampaignByIdService, updateCampaignService };