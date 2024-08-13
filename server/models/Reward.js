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
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'reward'
    });

    Reward.associate = (models) => {
        Reward.belongsTo(models.User, { through: "UserHistory", foreignKey: 'rewardId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    }

    return Reward;
    // Return Data model Event to allow index.js to sequelize and execute the DB
}