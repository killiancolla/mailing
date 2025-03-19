import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateMail = async (mailId, updates) => {
    try {
        const newMail = await prisma.mail.update({
            where: { id: parseInt(mailId) },
            data: {
                ...updates,
            },
        });
        return newMail;
    } catch (error) {
        throw new Error('Erreur lors de la modification du mail')
    }
};