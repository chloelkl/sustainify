const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { User, Admin, SentEmail } = require('../models');
const verifyToken = require('../middleware/verifyToken');
require('dotenv').config();

router.post('/send-email', verifyToken, async (req, res) => {
    const { subject, message } = req.body;

    try {
        const adminID = req.user.adminID;
        const admin = await Admin.findByPk(adminID);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found.' });
        }

        const users = await User.findAll({ attributes: ['email'] });
        const emailAddresses = users.map(user => user.email);

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: admin.email,
            to: emailAddresses.join(','),
            subject: subject,
            text: message,
            html: `<p>${message}</p>`
        });

        await SentEmail.create({
            subject,
            message,
            senderEmail: admin.email,
            recipientEmails: emailAddresses.join(','),
            sentAt: new Date()
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ error: 'Failed to send emails.' });
    }
});

// Route to get sent emails
router.get('/sent-emails', verifyToken, async (req, res) => {
    try {
        const sentEmails = await SentEmail.findAll({ order: [['sentAt', 'DESC']] });
        res.json(sentEmails);
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        res.status(500).json({ error: 'Failed to fetch sent emails.' });
    }
});

// Route to delete a sent email
router.delete('/sent-emails/:emailID', verifyToken, async (req, res) => {
    try {
        const { emailID } = req.params;
        const result = await SentEmail.destroy({ where: { emailID } });

        if (result === 0) {
            return res.status(404).json({ error: 'Email not found.' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting email:', error);
        res.status(500).json({ error: 'Failed to delete email.' });
    }
});

module.exports = router;
