const express = require('express');
const router = express.Router();
const { User } = require('../models');
const verifyToken = require('../middleware/auth');
const yup = require("yup");

router.get("/:id/settings", verifyToken, async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    const settings = {
        language: user.languages || ['English'],
        twoFactorAuth: user.twoFactorAuthEnabled,
        socialMediaLinks: user.linkedSocialMediaAccounts || { google: '', apple: '' }
    };
    res.json(settings);
});
