import { updateMail } from "../services/mail.service.js";

export const track_open = async (req, res) => {
    try {
        const { mail_id } = req.params;
        if (!mail_id) {
            res.status(400).json({ error: "Tous les champs sont requis." })
        }
        const newMail = await updateMail(mail_id, { status: 'ouvert', opened_at: new Date() });
        res.status(201).json(newMail);

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la modification du mail" })
    }
}