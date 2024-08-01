const express = require('express');
const router = express.Router();
const { User } = require('../models');
const verifyToken = require('../middleware/verifyToken');
const bcrypt = require('bcrypt');
const yup = require("yup");

// Validation schema for user updates
const userSchema = yup.object().shape({
    username: yup.string().min(3).max(50),
    email: yup.string().email(),
    password: yup.string().min(8).max(100),
    phoneNumber: yup.string(),
    countryCode: yup.string().max(5),
    location: yup.string().max(100),
});

router.get("/:userID/settings", verifyToken, async (req, res) => {
    try {
        const userID = req.params.userID;

        const user = await User.findByPk(userID, {
            attributes: ['language', 'twoFactorAuth'] // specify the attributes you want to retrieve
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({
            language: user.language,
            twoFactorAuth: user.twoFactorAuth ? 'Enabled' : 'Not Enabled',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user settings.' });
    }
});

// Update user settings
router.put("/:userID/settings", verifyToken, async (req, res) => {
    try {
        let userID = req.params.userID;
        let { language, twoFactorAuth } = req.body;

        const user = await User.findByPk(userID);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        user.language = language || user.language;
        user.twoFactorAuth = twoFactorAuth === 'Enabled';

        await user.save();
        res.json({ message: 'Settings updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update settings.' });
    }
});

// Get user analytics
router.get("/:id/analytics", verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findByPk(id);
        if (!user) return res.sendStatus(404);

        const analytics = [
            { metric: 'Challenges Completed', value: user.challengesCompleted || 0 },
            { metric: 'Points Earned', value: user.points || 0 }
        ];
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics.' });
    }
});

// Get user friends
router.get("/:id/friends", verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findByPk(id);
        if (!user) return res.sendStatus(404);

        // Assuming friends are stored in user model
        const friends = user.friends || [];
        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch friends.' });
    }
});

// Get messages between user and a friend
router.get("/:id/messages/:friendId", verifyToken, async (req, res) => {
    try {
        let { id, friendId } = req.params;
        // Assuming messages are stored in a Message model
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { from: id, to: friendId },
                    { from: friendId, to: id }
                ]
            }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

// Send a message to a friend
router.post("/:id/messages", verifyToken, async (req, res) => {
    try {
        let { id } = req.params;
        let { to, content } = req.body;
        // Assuming Message is a model in your database
        const newMessage = await Message.create({ from: id, to, content });
        res.json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

// Update user profile
router.put("/:userID", verifyToken, async (req, res) => {
    try {
        let userID = req.params.userID;
        const { username, email, password, phoneNumber, countryCode, location, fullName, bio } = req.body;

        // Validate incoming data
        await userSchema.validate(req.body, { abortEarly: false });

        const user = await User.findByPk(userID);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        // Update only fields that are present in the request body
        user.username = username || user.username;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.countryCode = countryCode || user.countryCode;
        user.location = location || user.location;
        user.fullName = fullName || user.fullName;
        user.bio = bio || user.bio;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});


// Get all users (for user management in admin panel)
router.get('/', verifyToken, async (req, res) => {
    try {
        console.log("Fetching all users");
        const users = await User.findAll();
        console.log("Users fetched: ", users);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

router.get("/:userID", verifyToken, async (req, res) => {
    try {
        let userID = req.params.userID;
        let user = await User.findByPk(userID);
        if (!user) return res.sendStatus(404);

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user details.' });
    }
});

// Delete a user
router.delete('/:userID', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user.' });
    }
});

module.exports = router;
