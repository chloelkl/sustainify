module.exports = (sequelize, DataTypes) => {
    const Forum = sequelize.define("Forum", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
          },
          allowNull: true
        }
      }, {
        tableName: 'forums'
      });

    Forum.associate = (models) => {
        Forum.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        Forum.belongsTo(models.Challenge, {
          foreignKey: 'challenge',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        });
    };
    
    return Forum;
    
};
