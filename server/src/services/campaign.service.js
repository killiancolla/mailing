import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCampaigns = async () => {
    return await prisma.campagne.findMany();
};

export const getCampaignByIdService = async (id) => {
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

export const createCampaign = async (nom) => {
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

export const updateCampaignService = async (id, data) => {
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