const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { User } = require('../models');

// User registration
router.post('/signup', [
    check('fullName').notEmpty().withMessage('Full name is required'),
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
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

        const payload = { userId: newUser.id, role: newUser.role };
        const token = jwt.sign(payload, process.env.APP_SECRET, { expiresIn: '1h' });

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

        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.APP_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});

module.exports = router;
