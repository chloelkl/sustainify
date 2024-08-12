// models/userHistory.js
module.exports = (sequelize, DataTypes) => {
    const UserHistory = sequelize.define("UserHistory", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        }
    }, {
        tableName: 'userhistory',
        timestamps: true,
    });

    UserHistory.associate = (models) => {
        UserHistory.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        UserHistory.belongsTo(models.Reward, {
            foreignKey: 'rewardId'
        });
    };

    return UserHistory;
};
