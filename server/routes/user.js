const express = require('express');
const router = express.Router();
const { User } = require('../models');
const verifyToken = require('../middleware/verifyToken');
const yup = require("yup");

router.get("/:id/settings", verifyToken, async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    const settings = {
        language: 'English',
        twoFactorAuth: false,
        socialMediaLinks: { google: '', apple: '' }
    };
    res.json(settings);
});

router.put("/:id/settings", verifyToken, async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    res.json({ message: 'Settings updated successfully' });
});

router.get("/:id/analytics", verifyToken, async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    const analytics = [
        { metric: 'Challenges Completed', value: 10 },
        { metric: 'Points Earned', value: 3000 }
    ];
    res.json(analytics);
});

router.get("/:id/friends", verifyToken, async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    const friends = [
        { id: 2, fullName: 'Friend 1' },
        { id: 3, fullName: 'Friend 2' }
    ];
    res.json(friends);
});

router.get("/:id/messages/:friendId", verifyToken, async (req, res) => {
    let { id, friendId } = req.params;
    const messages = [
        { from: id, to: friendId, content: 'Hello!' },
        { from: friendId, to: id, content: 'Hi!' }
    ];
    res.json(messages);
});

router.post("/:id/messages", verifyToken, async (req, res) => {
    let { id } = req.params;
    let { to, content } = req.body;
    const newMessage = { from: id, to, content };
    res.json(newMessage);
});

router.post("/:id/ai-chatbot", verifyToken, async (req, res) => {
    let { id } = req.params;
    let { message } = req.body;

    const aiResponse = `You said: ${message}`;
    res.json({ response: aiResponse });
});

// Update user profile
router.put("/:id", verifyToken, async (req, res) => {
    let id = req.params.id;
    const { username, email, password, phoneNumber, countryCode, location } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.countryCode = countryCode || user.countryCode;
        user.location = location || user.location;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile.' });
    } 
});

router.get("/retrieveDetails/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json(user);
})

module.exports = router;
