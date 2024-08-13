// models/rewardUser.js
module.exports = (sequelize, DataTypes) => {
    const RewardUser = sequelize.define('RewardUser', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'userID'
            }
        },
        rewardId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'reward',
                key: 'id'
            }
        },
        redeemedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        
        redemptionCode: { // New field
            type: DataTypes.STRING(8), // Adjust length as needed
            allowNull: true
        },
        rewardname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        redeemed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Default to false
        }
        

        // No need to define createdAt and updatedAt fields manually
    }, {
        tableName: 'RewardUser',
        timestamps: true,
    });

    RewardUser.associate = (models) => {
        RewardUser.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        RewardUser.belongsTo(models.Reward, {
            foreignKey: 'rewardId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return RewardUser;
};
