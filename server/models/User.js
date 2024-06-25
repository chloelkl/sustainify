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
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    }, {
        tableName: 'users'  // DB table name
        // Data model: Event mapped --> to DB table events
    });
    User.associate = (models) => {
        User.hasMany(models.Forum, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };
    return User;
};