module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        senderID: {
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
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'messages',
        timestamps: false
    });

    Message.associate = (models) => {
        Message.belongsTo(models.User, { as: 'Sender', foreignKey: 'senderID' });
        Message.belongsTo(models.User, { as: 'Recipient', foreignKey: 'recipientID' });
    };

    return Message;
};
