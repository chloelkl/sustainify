// verifyToken.js
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');

const verifyToken = async (req, res, next) => {
    console.log(req.headers)
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = verifyToken;
