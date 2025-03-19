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

export const addLeadService = async (email, prenom, nom, campagne_id) => {
    try {
        const newLead = await prisma.lead.create({
            data: {
                email, prenom, nom, campagne_id: parseInt(campagne_id)
            },
        });
        return newLead;
    } catch (error) {
        console.error(error)
        throw new Error('Erreur lors de la créatiion du lead')
    }
};