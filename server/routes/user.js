const express = require('express');
const router = express.Router();
const { User } = require('../models');
const verifyToken = require('../middleware/verifyToken');
const bcrypt = require('bcrypt');
const yup = require("yup");
const nodemailer = require('nodemailer');
require('dotenv').config();
const { authenticator } = require('otplib');
const QRCode = require('qrcode');

// Validation schema for user updates
const userSchema = yup.object().shape({
    username: yup.string().min(3).max(50),
    email: yup.string().email(),
    password: yup.string().min(8).max(100),
    phoneNumber: yup.string(),
    countryCode: yup.string().max(5),
    location: yup.string().max(100),
});

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        await user.save();

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        });

        res.json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

// Validate OTP
router.post('/validate-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP.' });
        }

        user.otp = null; // Clear the OTP after successful validation
        await user.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error validating OTP:', error);
        res.status(500).json({ error: 'Failed to validate OTP.' });
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

router.get("/:userID/rewards", verifyToken, async (req, res) => {
    try {
        let userID = req.params.userID;

        const user = await User.findByPk(userID);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        const points = user.pointsEarned

        res.json(points);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update points.' });
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

router.get("/retrieveDetails/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json(user);
})

router.post('/:userID/2fa/enable', async (req, res) => {
    try {
      const { userID } = req.params;
      console.log('Enabling 2FA for user:', userID);
  
      const secret = authenticator.generateSecret();
      console.log('Generated secret:', secret);
  
      // Save the secret to the user's record in the database and enable 2FA
      const [updatedRows] = await User.update(
        { 
            twoFactorAuthSecret: secret,
            twoFactorAuthEnabled: true  // Enable 2FA in the database
        },
        { where: { userID: userID } }
      );
      console.log('Updated rows:', updatedRows);
  
      if (updatedRows === 0) {
        console.log('User not found');
        return res.status(404).json({ error: 'User not found' });
      }
  
      const otpauthURL = authenticator.keyuri(userID, 'Sustainify', secret);
      console.log('OTP Auth URL:', otpauthURL);
      res.json({ otpauthURL });
    } catch (error) {
      console.error('Error enabling two-factor authentication:', error);
      res.status(500).json({ error: 'Failed to enable two-factor authentication' });
    }
});
  
// Verify 2FA during setup in user settings
router.post('/:userID/2fa/verify', async (req, res) => {
    try {
        const { userID, token } = req.body;

        // Retrieve the user's 2FA secret from the database
        const user = await User.findOne({ where: { userID } });

        if (!user.twoFactorAuthSecret) {
            return res.status(400).json({ error: 'Two-factor authentication secret not found' });
        }

        const verified = authenticator.verify({ token, secret: user.twoFactorAuthSecret });

        if (verified) {
            // Update the user's 2FA status in the database
            await User.update({ twoFactorAuthEnabled: true }, { where: { userID } });
            res.json({ message: 'Two-factor authentication verified and enabled successfully' });
        } else {
            res.status(400).json({ error: 'Invalid two-factor authentication token' });
        }
    } catch (error) {
        console.error('Error verifying two-factor authentication:', error);
        res.status(500).json({ error: 'Failed to verify two-factor authentication' });
    }
});


// Disable 2FA
router.put('/:userID/2fa/disable', async (req, res) => {
    try {
        const { userID } = req.params;

        // Update the user's 2FA status and remove the secret from the database
        await User.update({ twoFactorAuthEnabled: false, twoFactorAuthSecret: null }, { where: { userID } });

        res.json({ message: 'Two-factor authentication disabled successfully' });
    } catch (error) {
        console.error('Error disabling two-factor authentication:', error);
        res.status(500).json({ error: 'Failed to disable two-factor authentication' });
    }
});

module.exports = router;
