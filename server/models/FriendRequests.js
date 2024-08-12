module.exports = (sequelize, DataTypes) => {
    const FriendRequests = sequelize.define("FriendRequests", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        requesterID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'userID'
            }
        },
        recipientID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'userID'
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending'
        }
    }, {
        tableName: 'friendRequests',
        timestamps: false
    });

    FriendRequests.associate = (models) => {
        FriendRequests.belongsTo(models.User, { as: 'Requester', foreignKey: 'requesterID' });
        FriendRequests.belongsTo(models.User, { as: 'Recipient', foreignKey: 'recipientID' });
    };

    return FriendRequests;
};
