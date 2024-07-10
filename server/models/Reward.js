module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define("Reward", {
        rewardname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'reward' 
    });
    return Reward;
    // Return Data model Event to allow index.js to sequelize and execute the DB
}