const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Analytics, BackupHistory } = require('../models');
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/verifyToken');
require('dotenv').config();

// Analytics endpoint
router.get('/analytics', verifyToken, async (req, res) => {
    try {
        const analytics = await Analytics.findAll();
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics.' });
    }
});

// Backup history endpoint
router.get('/backup-history', verifyToken, async (req, res) => {
    try {
        const backupHistory = await BackupHistory.findAll();
        res.json(backupHistory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch backup history.' });
    }
});

// Create backup route
router.post('/backup', verifyToken, async (req, res) => {
    const { type, format } = req.body;
    let data;

    try {
        switch (type) {
            case 'analytics':
                data = await Analytics.findAll();
                break;
            case 'users':
                data = await User.findAll();
                break;
            case 'admin':
                data = await Admin.findAll();
                break;
            case 'full':
            default:
                data = {
                    analytics: await Analytics.findAll(),
                    users: await User.findAll(),
                };
                break;
        }

        let filePath;

        if (format === 'csv') {
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(data);
            filePath = path.join(__dirname, '..', 'backups', `backup_${type}_${Date.now()}.csv`);
            fs.writeFileSync(filePath, csv);
        } else if (format === 'pdf') {
            const doc = new PDFDocument();
            filePath = path.join(__dirname, '..', 'backups', `backup_${type}_${Date.now()}.pdf`);
            doc.pipe(fs.createWriteStream(filePath));
            doc.text(JSON.stringify(data, null, 2));
            doc.end();
        }

        const newBackup = await BackupHistory.create({
            name: `Backup ${type}`,
            date: new Date(),
            type,
            filePath
        });

        res.json(newBackup);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create backup.' });
    }
});

// Delete backup route
router.delete('/backup/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        const backup = await BackupHistory.findByPk(id);
        if (backup) {
            fs.unlinkSync(backup.filePath);
            await backup.destroy();
            res.json({ message: `Backup with id ${id} deleted successfully` });
        } else {
            res.status(404).json({ error: 'Backup not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete backup.' });
    }
});

// Generate Admin Signup Link
router.post('/generate-admin-signup', async (req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const token = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: '1h' }); // 1 hour expiration

        const signupLink = `${process.env.CLIENT_URL}/account/admin-signup?token=${token}`;

        res.json({ signupLink, otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

// Verify and Create Admin User
router.post('/auth/admin-signup', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const { fullName, email, password, otp } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.otp !== otp) {
            return res.status(401).json({ errors: [{ msg: 'Invalid OTP' }] });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, email, password: hashedPassword, role: 'admin' });

        res.status(201).json({ msg: 'Admin registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

module.exports = router;
