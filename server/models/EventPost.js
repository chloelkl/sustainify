module.exports = (sequelize, DataTypes) => {
    const EventPost = sequelize.define("EventPost", { // Data model instance
        // Define your DB fields with their required datatypes
        
        eventname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        eventdate: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^\d{2}\/\d{2}\/\d{4}$/
            }
        },
        eventtime: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^([01]\d|2[0-3]):?([0-5]\d)$/
            }
        },
        venue: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        eventdescription: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'eventposts'  // DB table name
        // Data model: Event mapped --> to DB table events
    });
    return EventPost;
    // Return Data model Event to allow index.js to sequelize and execute the DB
}
