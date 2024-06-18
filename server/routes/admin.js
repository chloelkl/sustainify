const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Analytics, BackupHistory } = require('../models');
const crypto = require('crypto');

// Analytics endpoint
router.get('/analytics', async (req, res) => {
    try {
        const analytics = await Analytics.findAll(); // Fetch from database
        console.log('Fetched analytics:', analytics); // Log the response
        res.json(analytics); // Ensure it returns an array
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics.' });
    }
});

// Backup history endpoint
router.get('/backup-history', async (req, res) => {
    try {
        const backupHistory = await BackupHistory.findAll(); // Fetch from database
        console.log('Fetched backup history:', backupHistory); // Log the response
        res.json(backupHistory); // Ensure it returns an array
    } catch (error) {
        console.error('Failed to fetch backup history:', error);
        res.status(500).json({ error: 'Failed to fetch backup history.' });
    }
});

// Create backup route
router.post('/backup', async (req, res) => {
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
                // Assuming you have an Admin model
                data = await Admin.findAll();
                break;
            case 'full':
            default:
                data = {
                    analytics: await Analytics.findAll(),
                    users: await User.findAll(),
                    // Add more data types as needed
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
        console.error('Failed to create backup:', error);
        res.status(500).json({ error: 'Failed to create backup.' });
    }
});

// Delete backup route
router.delete('/backup/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const backup = await BackupHistory.findByPk(id);
        if (backup) {
            fs.unlinkSync(backup.filePath); // Delete the file from the filesystem
            await backup.destroy(); // Delete the record from the database
            res.json({ message: `Backup with id ${id} deleted successfully` });
        } else {
            res.status(404).json({ error: 'Backup not found.' });
        }
    } catch (error) {
        console.error('Failed to delete backup:', error);
        res.status(500).json({ error: 'Failed to delete backup.' });
    }
});

// Generate OTP and Admin Signup Link
router.post('/generate-admin-signup', (req, res) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const token = jwt.sign({ otp }, process.env.APP_SECRET, { expiresIn: '1h' });
    const signupLink = `http://localhost:3000/account/admin/signup?token=${token}`;

    res.json({ signupLink, otp });
});

module.exports = router;
