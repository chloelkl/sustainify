const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { User, Admin } = require('../models');
require('dotenv').config();
const verifyToken = require('../middleware/verifyToken');
const generateUserID = require('../utils/generateUserID');
const generateAdminID = require('../utils/generateAdminID');
const { authenticator } = require('otplib');

// Generate JWT token
const generateToken = (user) => {
    const idKey = user.role === 'admin' ? 'adminID' : 'userID';
    return jwt.sign({ [idKey]: user[idKey], role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verify JWT token
router.get('/verify', verifyToken, (req, res) => {
    try {
        const idKey = req.user.role === 'admin' ? 'adminID' : 'userID';
        res.json({
            user: req.user,
            role: req.user.role,
            [idKey]: req.user[idKey],
        });
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
});

// User registration
router.post('/signup', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 4 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/).withMessage('Password must be at least 4 characters long, contain one uppercase, one lowercase, one number, and one special character.'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
    check('countryCode').notEmpty().withMessage('Country code is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, phoneNumber, countryCode } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const userID = await generateUserID();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            userID,
            username,
            email,
            password: hashedPassword,
            passwordLength: password.length, // Store password length
            phoneNumber,
            countryCode,
            role: 'user'
        });

        const token = generateToken(newUser);
        res.status(201).json({ token, role: newUser.role, userID: newUser.userID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

// Admin registration
router.post('/admin-signup', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 4 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/).withMessage('Password must be at least 4 characters long, contain one uppercase, one lowercase, one number, and one special character.'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
    check('countryCode').notEmpty().withMessage('Country code is required'),
    check('otp').notEmpty().withMessage('OTP is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, otp, username, phoneNumber, countryCode } = req.body;

    try {
        const token = req.body.token || req.query.token; // Fetch token from body or query
        console.log('Token provided:', token);
        if (!token) {
            return res.status(401).json({ errors: [{ msg: 'No token provided' }] });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        if (decoded.otp !== otp) {
            return res.status(401).json({ errors: [{ msg: 'Invalid OTP' }] });
        }

        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Admin already exists:', existingAdmin);
            return res.status(400).json({ errors: [{ msg: 'Admin already exists' }] });
        }

        const adminID = await generateAdminID();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            adminID,
            fullName,
            email,
            password: hashedPassword,
            role: 'admin',
            username,
            phoneNumber,
            countryCode
        });

        const adminToken = generateToken(newAdmin);
        res.status(201).json({ token: adminToken, role: newAdmin.role, adminID: newAdmin.adminID });
    } catch (error) {
        console.error('Error during admin signup:', error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

// User/Admin login
router.post('/login', [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        let isAdmin = false;

        if (!user) {
            user = await Admin.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }
            isAdmin = true;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        // Check if 2FA is enabled for users only
        if (!isAdmin && user.twoFactorAuthEnabled) {
            return res.json({
                twoFactorAuthRequired: true,
                userID: user.userID,
                role: 'user',
            });
        }

        const token = generateToken(user);
        const id = isAdmin ? user.adminID : user.userID;

        res.status(200).json({ token, role: user.role, id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

router.post('/verify-2fa', async (req, res) => {
    try {
        const { userID, token } = req.body;

        const user = await User.findOne({ where: { userID } });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }

        const verified = authenticator.verify({ token, secret: user.twoFactorAuthSecret });

        if (verified) {
            const jwtToken = generateToken(user.userID, user.role);
            return res.json({
                token: jwtToken,
                role: user.role,
                userID: user.userID,
            });
        } else {
            return res.status(400).json({ errors: [{ msg: 'Invalid 2FA code' }] });
        }
    } catch (error) {
        console.error('Error verifying 2FA during login:', error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

// Generate Admin Signup Link
router.post('/generate-admin-signup', async (req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const token = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: '1h' }); // 1 hour expiration

        const signupLink = `${process.env.CLIENT_URL}/account/admin-signup?token=${token}`;

        res.json({ signupLink, otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

module.exports = router;
