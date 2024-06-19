const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { User } = require('../models');
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
    check('fullName').notEmpty().withMessage('Full name is required'),
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 4 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/).withMessage('Password must be at least 4 characters long, contain one uppercase, one lowercase, one number, and one special character.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, role } = req.body;
    const userRole = role === 'admin' ? 'admin-pending' : 'user';

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, email, password: hashedPassword, role: userRole });

        const token = generateToken(newUser);

        res.status(201).json({ token, role: newUser.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

// User login
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
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
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

module.exports = router;
