module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define("Challenge", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    challenge: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    tableName: 'challenges'
  });

  Challenge.associate = (models) => {
    Challenge.belongsToMany(models.User, { through: "UserChallenges", foreignKey: 'challenge' });
  };

  return Challenge;
};