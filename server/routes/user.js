const express = require('express');
const router = express.Router();
const { User, FriendRequests, Message, Friends } = require('../models');
const verifyToken = require('../middleware/verifyToken');
const bcrypt = require('bcrypt');
const yup = require("yup");
const nodemailer = require('nodemailer');
require('dotenv').config();
const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const { Op } = require('sequelize');

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

router.get("/:userID/settings", verifyToken, async (req, res) => {
    try {
        const userID = req.params.userID;
        const user = await User.findByPk(userID);
        
        if (!user) return res.status(404).json({ error: 'User not found.' });
        
        res.json({
            language: user.language,
            twoFactorAuth: user.twoFactorAuthEnabled ? 'Enabled' : 'Not Enabled'
        });
    } catch (error) {
        console.error('Error fetching user settings:', error);
        res.status(500).json({ error: 'Failed to fetch user settings.' });
    }
});


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

// Send a friend request
router.post('/friend-request', verifyToken, async (req, res) => {
    try {
        const { requesterID, recipientID } = req.body;

        const existingRequest = await FriendRequests.findOne({ where: { requesterID, recipientID } });

        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already sent.' });
        }

        const newRequest = await FriendRequests.create({ requesterID, recipientID });
        res.json(newRequest);
    } catch (error) {
        console.error('Error sending friend request:', error); // Log the detailed error
        res.status(500).json({ error: 'Failed to send friend request.' });
    }
});

router.get('/:userID/friend-requests', verifyToken, async (req, res) => {
    try {
        const requests = await FriendRequests.findAll({
            where: { recipientID: req.params.userID, status: 'Pending' },
            include: [{ model: User, as: 'Requester', attributes: ['userID', 'username', 'fullName'] }],
        });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).json({ error: 'Failed to fetch friend requests.' });
    }
});

// Accept a friend request
router.put('/friend-request/accept', verifyToken, async (req, res) => {
    try {
        const { id } = req.body;
        console.log('Friend request ID to accept:', id);

        const request = await FriendRequests.findByPk(id);
        if (!request) {
            console.error('Friend request not found with ID:', id);
            return res.status(404).json({ error: 'Friend request not found.' });
        }

        await request.update({ status: 'Accepted' });

        // Create a bidirectional friendship
        await Friends.create({
            userID: request.requesterID,
            friendID: request.recipientID,
        });
        await Friends.create({
            userID: request.recipientID,
            friendID: request.requesterID,
        });

        res.json({ message: 'Friend request accepted and friendship created.' });
    } catch (error) {
        console.error('Error accepting friend request:', error.message);
        console.error('Stack Trace:', error.stack);
        res.status(500).json({ error: 'Failed to accept friend request.' });
    }
});

router.get('/search', verifyToken, async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ error: 'Username query parameter is required' });
    }

    try {
        const users = await User.findAll({
            where: {
                username: {
                    [Op.like]: `%${username}%`
                }
            }
        });

        res.json(users);
    } catch (error) {
        console.error('Error searching for users:', error);
        res.status(500).json({ error: 'Failed to search for users' });
    }
});

router.get('/:userID/friends', verifyToken, async (req, res) => {
    try {
        const userID = req.params.userID;
        const user = await User.findByPk(userID, {
            include: [{
                model: User,
                as: 'UserFriends', // Match this alias to your model's alias
                attributes: ['userID', 'username', 'fullName']
            }]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.UserFriends); // Sending back the user's friends
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Failed to fetch friends.' });
    }
});

router.get('/:userID/messages/:friendID', verifyToken, async (req, res) => {
    try {
        const { userID, friendID } = req.params;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderID: userID, recipientID: friendID },
                    { senderID: friendID, recipientID: userID },
                ],
            },
            order: [['createdAt', 'ASC']],
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

// Send a message to a friend
router.post("/:userID/messages", verifyToken, async (req, res) => {
    try {
        const { userID } = req.params; // Extract userID from the route parameters
        const { to, content } = req.body; // Extract the recipient and content from the request body

        // Create a new message in the database
        const newMessage = await Message.create({
            from: userID,  // Sender's ID from the route
            to,            // Recipient's ID from the request body
            content        // Message content from the request body
        });

        // Send the newly created message as the response
        res.json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

// Update user profile
router.put("/:userID", verifyToken, async (req, res) => {
    try {
        let userID = req.params.userID;
        const { username, email, password, phoneNumber, countryCode, location, fullName, bio } = req.body;

        const user = await User.findByPk(userID);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        // Update only fields that are provided
        user.username = username || user.username;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.countryCode = countryCode || user.countryCode;
        user.location = location || user.location;
        user.fullName = fullName || user.fullName;
        user.bio = bio || user.bio;

        // Only update the password if it's provided and different
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            user.passwordLength = password.length; // Update the password length
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

        res.json({
            ...user.toJSON(),
            passwordLength: user.passwordLength, // Return the length of the original password
        });
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
            twoFactorAuthEnabled: true
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
  
router.post('/:userID/2fa/verify', async (req, res) => {
    try {
        const { token } = req.body;
        const userID = req.params.userID;

        // Log userID and token for debugging
        console.log('Verifying 2FA for userID:', userID);
        console.log('Received token:', token);

        // Ensure userID is correctly passed and defined
        if (!userID) {
            console.error('Missing userID');
            return res.status(400).json({ error: 'Missing userID' });
        }

        // Retrieve the user's 2FA secret from the database
        const user = await User.findOne({ where: { userID } });

        if (!user) {
            console.error('User not found:', userID);
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.twoFactorAuthSecret) {
            console.error('Two-factor authentication secret not found for user:', userID);
            return res.status(400).json({ error: 'Two-factor authentication secret not found' });
        }

        // Verify the token with the user's secret
        const verified = authenticator.verify({ token, secret: user.twoFactorAuthSecret });

        if (verified) {
            // Update the user's 2FA status in the database
            const updatedRows = await User.update({ twoFactorAuthEnabled: true }, { where: { userID } });
            console.log('2FA status updated for user:', userID, 'Rows affected:', updatedRows);

            res.json({ message: 'Two-factor authentication verified and enabled successfully' });
        } else {
            console.error('Invalid two-factor authentication token for user:', userID);
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
