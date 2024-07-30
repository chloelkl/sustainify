const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Request Headers:', req.headers); // Debugging line
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted Token:', token); // Debugging line

    if (!token) return res.status(401).json({ msg: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Error during token verification:', err); // Debugging line
            return res.status(403).json({ msg: 'Token is not valid' });
        }
        console.log('Decoded Token:', user); // Debugging line
        req.user = user;
        next();
    });
};

module.exports = verifyToken;
