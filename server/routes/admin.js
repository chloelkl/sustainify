const express = require('express');
const router = express.Router();
const { User } = require('../models');
const yup = require("yup");

// Analytics route
router.get('/analytics', async (req, res) => {
    const analytics = [
        { metric: 'Total Users', value: 500 },
        { metric: 'Active Users', value: 300 },
        { metric: 'Challenges Completed', value: 200 }
    ];
    res.json(analytics);
});

// Backup history route
router.get('/backup-history', async (req, res) => {
    const backupHistory = [
        { id: 1, name: 'Backup A', date: '2024-01-01', type: 'Full' },
        { id: 2, name: 'Backup B', date: '2024-02-01', type: 'Incremental' }
    ];
    res.json(backupHistory);
});

// Create backup route
router.post('/backup', async (req, res) => {
    const newBackup = { id: 3, name: 'Backup C', date: '2024-03-01', type: 'Full' };
    res.json(newBackup);
});

// Delete backup route
router.delete('/backup/:id', async (req, res) => {
    const id = req.params.id;
    res.json({ message: `Backup with id ${id} deleted successfully` });
});

// Users route
router.get("/users", async (req, res) => {
    let users = await User.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.json(users);
});

module.exports = router;
