const express = require('express');
const router = express.Router();
const { Admin, BackupHistory, Analytics } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// Update admin profile
router.put('/:adminID', verifyToken, async (req, res) => {
    const { adminID } = req.params;
    const { fullName, email, password, location, username, phoneNumber, countryCode } = req.body;

    try {
        const admin = await Admin.findByPk(adminID);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found.' });
        }

        admin.fullName = fullName || admin.fullName;
        admin.email = email || admin.email;
        admin.phoneNumber = phoneNumber || admin.phoneNumber;
        admin.countryCode = countryCode || admin.countryCode;
        admin.location = location || admin.location;
        admin.username = username || admin.username;

        if (password) {
            admin.password = await bcrypt.hash(password, 10);
        }

        await admin.save();
        res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// Fetch list of admins
router.get('/list', verifyToken, async (req, res) => {
    try {
        const admins = await Admin.findAll();
        console.log('Fetched admins:', admins); // Debugging line
        res.json(admins);
    } catch (error) {
        console.error('Failed to fetch admins:', error);
        res.status(500).json({ error: 'Failed to fetch admins.' });
    }
});


router.get('/:id', verifyToken, async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found.' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Failed to fetch admin details:', error);
        res.status(500).json({ error: 'Failed to fetch admin details.' });
    }
});


// Delete an admin
router.delete('/delete', verifyToken, async (req, res) => {
    const { adminID, password } = req.body;

    try {
        if (!adminID || !password) {
            return res.status(400).json({ error: 'Missing id or password.' });
        }

        const admin = await Admin.findOne({ where: { adminID } });
        if (!admin) {
            console.error('Admin not found with ID:', adminID);
            return res.status(404).json({ error: 'Admin not found.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.error('Incorrect password provided for admin ID:', adminID);
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        // Fetch the total number of admins before attempting deletion
        const totalAdmins = await Admin.count();

        await Admin.destroy({ where: { adminID } });

        if (totalAdmins <= 1) {
            return res.status(200).json({ message: 'Admin deleted successfully. No more admins left.' });
        }
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ error: 'Failed to delete admin.' });
    }
});

module.exports = router;
