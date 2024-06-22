module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
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
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '+65'
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pointsEarned: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        preferences: {
            type: DataTypes.JSON,
            allowNull: true
        },
        linkedSocialMediaAccounts: {
            type: DataTypes.JSON,
            allowNull: true
        },
        twoFactorAuthEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        languages: {
            type: DataTypes.JSON,
            allowNull: true
        },
        securityQuestions: {
            type: DataTypes.JSON,
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        notifications: {
            type: DataTypes.JSON,
            allowNull: true
        }
    });

    return User;
};
