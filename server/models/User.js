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
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        twoFactorAuthSecret: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        twoFactorAuthEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        passwordLength: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
      User.belongsToMany(models.Challenge, { through: "UserChallenges", foreignKey: 'user' });
      User.hasMany(models.UserHistory, {foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE'});  
      
      User.hasMany(models.SavedForum, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.FriendRequests, { as: "SentRequests", foreignKey: 'requesterID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      User.hasMany(models.FriendRequests, { as: "ReceivedRequests", foreignKey: 'recipientID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      
      User.belongsToMany(models.User, {
        as: 'UserFriends',
        through: models.Friends,
        foreignKey: 'userID',
        otherKey: 'friendID'
      });
    
    };

    return User;
};
