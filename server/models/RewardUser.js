const Reward = require("./Reward");

// models/rewardUser.js
module.exports = (sequelize, DataTypes) => {
    const RewardUser = sequelize.define('RewardUser', {
        user: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'userID'
            }
        },
        reward: {
            type: DataTypes.INTEGER,
            references: {
                model: 'reward',
                key: 'id'
            }
        },
        // No need to define createdAt and updatedAt fields manually
    }, {
        tableName: 'RewardUser',
        timestamps: true,
    });

    return RewardUser;
};
