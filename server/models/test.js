module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define("Test", { // Data model instance
        // define your DB fields with their required datatypes
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        tableName: 'tests'  // DB table name
        // Data model: Event mapped --> to DB table events
    });
    return Test;
    // Return Data model Event to allow index.js to sequelize and execute the DB
}