import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { sendEmail } from "../lib/mailer.js";

const sendEmailsAutomatically = async () => {
    const settings = await prisma.setting.findFirst();
    const { start_hour, end_hour, days_active, frequency } = settings;

    const now = new Date();
    const day = now.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const days_active_tab = days_active.days_active;
    const hour = now.getHours();

    if (!days_active_tab.includes(day) || hour < start_hour || hour >= end_hour) {
        console.log("Hors des heures d'envoi");
        return;
    }

    const campaigns = await prisma.campagne.findMany({
        where: {
            status: 1
        }
    })

    for (const campagne of campaigns) {
        const campagneId = campagne.id;

        const leads = await prisma.lead.findMany({
            where: {
                campagne_id: campagneId,
                statut: 1
            },
        });

        if (!leads || leads.length === 0) {
            console.log("Aucun lead en attente.");
            return;
        }

        for (const lead of leads) {
            const lastStepMail = await prisma.mail.findFirst({
                where: {
                    lead_id: lead.id,
                    campagne_id: campagneId,
                },
                orderBy: {
                    sent_at: 'desc',
                },
                select: {
                    sent_at: true,
                    campagne_mail_id: true,
                },
            });

            let nextStepMail;
            if (lastStepMail && lastStepMail.sent_at) {
                const lastStepMailDate = lastStepMail.sent_at;
                const diffInDays = (now - lastStepMailDate) / (1000 * 3600 * 24);

                const lastStep = await prisma.campagneMail.findFirst({
                    where: { id: lastStepMail.campagne_mail_id },
                    select: { step: true }
                })

                if (diffInDays >= 3) {
                    nextStepMail = await prisma.campagneMail.findFirst({
                        where: {
                            campagne_id: campagneId,
                            step: lastStep.step + 1,
                        },
                    });
                }
            } else {

                const lastMail = await prisma.mail.findFirst({
                    where: {
                        campagne_id: campagneId,
                        campagne_mail: {
                            step: 1,
                        },
                    },
                    orderBy: {
                        sent_at: 'desc',
                    },
                    select: {
                        sent_at: true,
                    },
                });


                if (lastMail && lastMail.sent_at) {
                    const lastMailDate = lastMail.sent_at;
                    const diffInMilliseconds = now - lastMailDate;
                    const diffInMinutes = diffInMilliseconds / (1000 * 60);

                    if (diffInMinutes < frequency) {
                        console.log("Le dernier mail a été envoyé il y a moins de " + frequency + " minutes");
                        continue;
                    }
                }

                nextStepMail = await prisma.campagneMail.findFirst({
                    where: {
                        campagne_id: campagneId,
                        step: 1,
                    },
                });
            }

            if (nextStepMail) {

                await sendEmail(lead, nextStepMail);

            } else {
                console.log("Aucune étape suivante pour le lead " + lead.id);
            }
        }
    }

};

sendEmailsAutomatically().catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
        process.exit(0);
    });
