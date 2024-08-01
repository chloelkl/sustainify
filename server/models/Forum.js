module.exports = (sequelize, DataTypes) => {
    const Forum = sequelize.define("Forum", {

        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primarykey: true
        },
    });

    return Forum;
    
};
