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
    Challenge.hasMany(models.Forum, {
      foreignKey: 'challenge',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    Challenge.belongsToMany(models.User, { through: "UserChallenges", foreignKey: 'challenge' });
  };

  return Challenge;
};