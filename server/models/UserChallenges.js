module.exports = (sequelize, DataTypes) => {
  const UserChallenges = sequelize.define('UserChallenges', {
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'userID'
      }
    },
    challenge: {
      type: DataTypes.INTEGER,
      references: {
        model: 'challenges',
        key: 'id'
      }
    },
    completedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'userchallenges',
    timestamps: true,
  });

  return UserChallenges;
};