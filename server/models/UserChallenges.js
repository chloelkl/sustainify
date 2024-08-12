module.exports = (sequelize, DataTypes) => {
  const UserChallenges = sequelize.define('UserChallenges', {
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userID'
      }
    },
    challenge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'challenges',
        key: 'id'
      }
    },
    forum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Forums',
        key: 'id'
      }
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'userchallenges',
    timestamps: true,
  });

  return UserChallenges;
};