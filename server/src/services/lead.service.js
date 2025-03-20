import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLeadsService = async () => {
    return await prisma.lead.findMany();
};

export const getAllLeadsByCampaignService = async (id) => {
    return await prisma.lead.findMany({
        where: {
            campagne_id: parseInt(id)
        }
    });
};

export const addLeadService = async (email, prenom, nom, ville, website, campagne_id) => {
    try {
        const newLead = await prisma.lead.create({
            data: {
                email, prenom, nom, ville, website, campagne_id: parseInt(campagne_id)
            },
        });
        return newLead;
    } catch (error) {
        console.error(error)
        throw new Error('Erreur lors de la créatiion du lead')
    }
};

export const updateLeadService = async (id, data) => {
    try {
        const newLead = await prisma.lead.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!newLead)
            return null;

        return await prisma.lead.update({
            where: {
                id: parseInt(id)
            },
            data: data
        });

    } catch (error) {
        throw new Error('Erreur lors de la modification du lead.');
    }
};