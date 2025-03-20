import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail(lead, mail) {

    const applyConditions = (text, lead) => {
        text = text.replace(/\${([^}]+)}/g, (match, variable) => {
            if (lead[variable] !== undefined) {
                return lead[variable];
            }
            return match;
        });

        text = text.replace(/{([^?]+)\?([^:]+):([^}]+)}/g, (match, condition, trueValue, falseValue) => {
            condition = condition.trim()
            if (lead[condition] !== undefined) {
                return lead[condition] ? trueValue : falseValue;
            }
            return match;
        });

        return text;
    };


    const subject = applyConditions(mail.subject, lead).trim();
    const body = applyConditions(mail.body, lead).trim();

    let mailId = "";

    try {

        const result = await prisma.mail.create({
            data: {
                campagne_id: lead.campagne_id,
                campagne_mail_id: mail.id,
                lead_id: lead.id,
                email: lead.email,
                subject: subject,
                body: body,
                sent_at: new Date(),
                status: "envoyé",
            },
        });

        mailId = parseInt(result.id); // Récupération de l'ID du mail inséré

        // const result = await db.query(
        //     "INSERT INTO Mail (campagne_id, lead_id, email, subject, body, sent_at, status) VALUES (1, ?, ?, ?, ?, NOW(), 'envoyé')",
        //     [lead.id, lead.email, subject, body]
        // );
        // const mailId = result[0].insertId;

        const trackingPixel = `<img src="${process.env.BACK_URL}/mail/track-open/${mailId}" width="1" height="1" />`;
        const unsubscribe = `<br><br><br>Si vous ne souhaitez plus recevoir de mails de ma part : <a href="${process.env.FRONT_URL}/unsubscribe/${lead.id}">se désinscrire</a>`
        const finalBody = `${body} ${trackingPixel} ${unsubscribe}`;

        const mailOptions = {
            from: '"Killian Colla" <contact@killian-colla.com>',
            to: lead.email,
            subject: subject,
            html: finalBody.replace(/\n/g, '<br>'),
        };

        await transporter.sendMail(mailOptions);

        console.log(`Email envoyé à ${lead.email} avec mail_id ${mailId}`);

        await prisma.mail.update({
            where: { id: mailId },
            data: { body: finalBody },
        });

        // await db.query(
        //     "UPDATE Mail SET body = ? WHERE id = ?",
        //     [finalBody, mailId]
        // );

    } catch (error) {
        console.error("Erreur d'envoi", error);
        await prisma.mail.update({
            where: { id: mailId },
            data: { status: 'échoué' },
        });
    }
}