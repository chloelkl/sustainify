module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
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
            defaultValue: 'user' // assuming users are by default assigned the 'user' role
        }
    });
    return User;
};
