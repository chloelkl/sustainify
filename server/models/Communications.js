module.exports = (sequelize, DataTypes) => {
    const Communication = sequelize.define("Communication", {
        to: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'communications'
    });
    return Communication;
};
