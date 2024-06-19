module.exports = (sequelize, DataTypes) => {
    const Forum = sequelize.define("Forum", {

        name: {
            type: DataTypes.STRING(50),
            allowull: false
        },

        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
        // image
        
    }, {
        tableName: 'forums' 

    });

    return Forum;
   
}