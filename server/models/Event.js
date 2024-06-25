module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", { // Data model instance
        // define your DB fields with their required datatypes
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // dateTime: {
        //     type: DataTypes.DATE,
        //     allowNull: false
        // },
        attendees: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'events'  // DB table name
        // Data model: Event mapped --> to DB table events
    });
    return Event;
    // Return Data model Event to allow index.js to sequelize and execute the DB
}
