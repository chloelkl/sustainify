module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user'
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pointsEarned: {
            type: DataTypes.INTEGER,
            defaultValue: 1500
        },
        language: {
            type: DataTypes.STRING,
            allowNull: true
        },
        twoFactorAuth: {
            type: DataTypes.STRING,
            defaultValue: 'Not Enabled',
            allowNull: true
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        notifications: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
      tableName: 'users'
    });
    
    User.associate = (models) => {
      User.hasMany(models.Forum, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
      });
      User.hasMany(models.Forum, {foreignKey: 'userId'});
      User.belongsToMany(models.Challenge, { through: "UserChallenges", foreignKey: 'user' });
      User.belongsToMany(models.Reward, { through: "RewardUser", foreignKey: 'user'});
    };
    return User;
};
