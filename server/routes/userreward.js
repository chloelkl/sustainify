const express = require('express');
const router = express.Router();
const { User, Reward, RewardUser, UserHistory } = require('../models');

// Create a new RewardUser
router.post('/', async (req, res) => {
    try {
        const newUser = await UserHistory.create({
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
        const users = await UserHistory.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve a RewardUser by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await UserHistory.findByPk(req.params.id);
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
        const [updated] = await UserHistory.update(req.body, {
            where: { user: req.params.id }
        });
        if (updated) {
            const updatedUser = await UserHistory.findByPk(req.params.id);
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
        const deleted = await UserHistory.destroy({
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

const { v4: uuidv4 } = require('uuid');

router.post('/Redeemed', async (req, res) => {
    const { userId, rewardId } = req.body;

    try {
        // Fetch user and reward
        const user = await User.findByPk(userId);
        const reward = await Reward.findByPk(rewardId);

        if (!user || !reward) {
            return res.status(404).json({ message: "User or Reward not found" });
        }

        // Check if the reward has already been redeemed by the user
        const existingRedeemption = await UserHistory.findOne({
            where: { userId: userId, rewardId: rewardId }
        });

        if (existingRedeemption) {
            return res.status(400).json({ message: "User already redeemed this reward" });
        }

        // Deduct points from user
        user.pointsEarned -= reward.points;
        
        // Create a new UserHistory entry
        await UserHistory.create({
            description: "Redeemed Rewards",
            points: -reward.points, // Using integer for points
            userId: userId,
            rewardId: rewardId
        });

        const redemptionCode = uuidv4().slice(0, 8);

        // Create a new RewardUser entry
        await RewardUser.create({
            userId: userId,
            rewardId: rewardId,
            redeemedAt: new Date(),
            redemptionCode: redemptionCode,
            rewardname: reward.rewardname,
            points: reward.points,
            redeemed: true,
        });

        // Save updated user points
        await user.save();

        res.json({ message: 'Reward redeemed successfully.', pointsEarned: user.pointsEarned });
    } catch (error) {
        res.status(500).json({ message: "Error redeeming reward" });
        console.error(error);
    }
});

router.get('/reward-history/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const rewardHistory = await RewardUser.findAll({
            where: { userId },
            order: [['redeemedAt', 'DESC']]
        });

        console.log('Reward History:', rewardHistory); // Log the result

        if (!rewardHistory || rewardHistory.length === 0) {
            res.json([])
        } else {
            res.json(rewardHistory);
        }

        
    } catch (error) {
        res.status(500).json({ message: "Error fetching reward history" });
        console.error("Error details:", error);
    }
});

router.get('/points-history/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const pointHistory = await UserHistory.findAll({
            where: { userId },
            order: [['redeemedAt', 'DESC']]
        });

        console.log('Points History:', pointHistory); // Log the result

        if (!pointHistory || pointHistory.length === 0) {
            return res.status(404).json({ message: "No point history found for this user" });
        }

        res.json(pointHistory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching point history" });
        console.error("Error details:", error);
    }
});


module.exports = router;

