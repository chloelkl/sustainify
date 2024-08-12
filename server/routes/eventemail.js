// eventemail.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Event, EventEmail } = require('../models');
require('dotenv').config();

router.post('/send', async (req, res) => {
    const { eventId } = req.body;

    try {
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const message = `
            <p>Dear ${event.eventhoster},</p>

            <p>We are pleased to inform you that your event has been successfully approved by our administration team. Below are the details of your confirmed booking:</p>

            <p><strong>Event Name:</strong> ${event.eventname}</p>
            <p><strong>Event Date:</strong> ${event.eventdate}</p>
            <p><strong>Event Time:</strong> ${event.eventtime}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Description:</strong> ${event.eventdescription}</p>

            <p>If you have any images related to the event that you would like to upload, please kindly email them to us at your earliest convenience.</p>

            <p>If you did not request this approval or if you would like to cancel your booking, please contact us immediately.</p>

            <p>Thank you for choosing our services. We look forward to hosting your event.</p>

            <p>Best regards,</p>
            <p>The Events Team</p>
        `;

        await transporter.sendMail({
            from: `"Events Team" <${process.env.SMTP_USER}>`,
            to: event.email,  // This will send the email to the event hoster's email stored in the database
            subject: "Booking Confirmation: Your Event has been Approved",
            html: message
        });

        await EventEmail.create({
            eventId: event.id,
            email: event.email,
            status: 'sent',
            sentAt: new Date()
        });

        res.json({ message: 'Booking confirmation email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send booking confirmation email.' });
    }
});

module.exports = router;
