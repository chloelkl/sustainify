module.exports = (sequelize, DataTypes) => {
    const Analytics = sequelize.define('Analytics', {
        metric: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'analytics'
    }
    );

    return Analytics;
};
