const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { User, Admin } = require('../models');
const verifyToken = require('../middleware/verifyToken');
require('dotenv').config();

router.post('/send-email', verifyToken, async (req, res) => {
    const { subject, message } = req.body;

    try {
        // Extract the admin ID from the token
        const adminID = req.user.adminID;

        // Fetch the admin's details
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

        let info = await transporter.sendMail({
            from: admin.email,
            to: emailAddresses.join(','),
            subject: subject,
            text: message,
            html: `<p>${message}</p>`
        });

        console.log("Emails sent: %s", info.messageId);
        res.json({ message: 'Emails sent successfully!' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ error: 'Failed to send emails.' });
    }
});

module.exports = router;
