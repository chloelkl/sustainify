module.exports = (sequelize, DataTypes) => {
  const UserHistory = sequelize.define("UserHistory", {
      id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          primaryKey: true,
          autoIncrement: true
      },
      description: {
          type: DataTypes.STRING(500),
          allowNull: false
      },
      points: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'users',
              key: 'userID'
          }
      },
  }, {
      tableName: 'userhistory'

  });

  UserHistory.associate = (models) => {
    UserHistory.belongsTo(models.User, {
          foreignKey: 'userId'
      });
  };
  
  return UserHistory;
  
};
