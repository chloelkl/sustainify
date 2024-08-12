module.exports = (sequelize, DataTypes) => {
    const Friends = sequelize.define("Friends", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'userID'
            }
        },
        friendID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'userID'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'friends',
        timestamps: false
    });

    Friends.associate = (models) => {
        Friends.belongsTo(models.User, { as: 'User', foreignKey: 'userID' });
        Friends.belongsTo(models.User, { as: 'Friend', foreignKey: 'friendID' });
    };

    return Friends;
};
