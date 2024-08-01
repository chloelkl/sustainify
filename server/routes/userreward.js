const express = require('express');
const router = express.Router();
const { RewardUser, User, Reward } = require('../models');

// Create a new RewardUser
router.post('/', async (req, res) => {
    try {
        const newUser = await RewardUser.create({
            points: req.body.points || 1000 
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all RewardUsers
router.get('/', async (req, res) => {
    try {
        const users = await RewardUser.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve a RewardUser by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await RewardUser.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Update a RewardUser by ID
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await RewardUser.update(req.body, {
            where: { user: req.params.id }
        });
        if (updated) {
            const updatedUser = await RewardUser.findByPk(req.params.id);
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a RewardUser by ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await RewardUser.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/Redeemed', async (req, res) => {
    const { userId, rewardId } = req.body;
    try {
        const user = await User.findByPk(userId);
        const reward = await Reward.findByPk(rewardId);

        if (!user || !reward) {
            return res.status(404).json({ message: "User or Reward not found" });
        }

        const existingRedeemption = await RewardUser.findOne({
            where: { user: userId, reward: rewardId }
        });

        if (existingRedeemption) {
            return res.status(400).json({ message: "User already redeemed this reward" });
        }

        // Deduct points from user
        user.pointsEarned -= reward.points;
        await user.save();

        // await RewardUser.create({ userId, rewardId });
        await user.addReward(rewardId);

        res.json({ message: 'Reward redeemed successfully.', pointsEarned: user.pointsEarned });
    } catch (error) {
        res.status(500).json({ message: "Error redeeming reward" });
        console.error(error);
    }
});

module.exports = router;

