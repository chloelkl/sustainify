const { User } = require('../models');

const generateUserID = async () => {
    const userID = await User.max('userID') || 0;
    return userID  + 1;
};

module.exports = generateUserID;
