module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define("Reward", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        rewardname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rewardImage: {
            type: DataTypes.STRING(20)
        }
    }, {
        tableName: 'reward' 
    });

    Reward.associate = (models) => {
        Reward.belongsToMany(models.User, { through: "RewardUser", foreignKey: 'reward'})
    }

    return Reward;
    // Return Data model Event to allow index.js to sequelize and execute the DB
}