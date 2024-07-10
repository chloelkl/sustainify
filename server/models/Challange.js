module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define("Challenge", {
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
  return Challenge;
  // Return Data model Event to allow index.js to sequelize and execute the DB
}