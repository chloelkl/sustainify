const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { User, Admin } = require('../models');
require('dotenv').config();

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verify JWT token
router.get('/verify', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json(decoded);
    } catch (err) {
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

    const { username, email, password, phoneNumber, countryCode, role } = req.body;
    const userRole = role === 'admin' ? 'admin-pending' : 'user';

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, phoneNumber, countryCode, role: userRole });

        const token = generateToken(newUser);

        res.status(201).json({ token, role: newUser.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

// Admin registration
router.post('/admin-signup', async (req, res) => {
    const { fullName, email, password, otp, token, username, phoneNumber, countryCode } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.otp !== otp) {
            return res.status(401).json({ errors: [{ msg: 'Invalid OTP' }] });
        }

        const existingUser = await Admin.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            fullName,
            email,
            password: hashedPassword,
            role: 'admin',
            username,
            phoneNumber,
            countryCode
        });

        res.status(201).json({ msg: 'Admin registered successfully' });
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
        // Check User model first
        let user = await User.findOne({ where: { email } });
        if (!user) {
            // If not found, check Admin model
            user = await Admin.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const token = generateToken(user);

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error(error);
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
