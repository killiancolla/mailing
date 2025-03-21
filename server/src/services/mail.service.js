import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateMail = async (mailId, updates) => {
    try {

        const mail = await prisma.mail.findUnique({
            where: { id: parseInt(mailId) },
            select: { opened_at: true, sent_at: true },
        });

        if (!mail) {
            throw new Error("Mail non trouvé");
        }

        if (mail.opened_at) {
            return mail;
        }

        const sentAt = new Date(mail.sent_at);
        const now = new Date();
        const delayMilliseconds = 15000;

        if ((now - sentAt) < delayMilliseconds) {
            return mail;
        }

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