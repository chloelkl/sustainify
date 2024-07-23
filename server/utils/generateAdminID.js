const { Admin } = require('../models');

const generateAdminID = async () => {
    const maxAdminID = await Admin.max('adminID') || 0;
    return maxAdminID + 1;
};

module.exports = generateAdminID;
