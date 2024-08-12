module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", { // Data model instance
        // define your DB fields with their required datatypes
        eventhoster: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phonenumber: {
            type: DataTypes.STRING(8),
            allowNull: false,
            validate: {
                is: /^[6-9]\d{7}$/
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
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
        }
    }, {
        tableName: 'events'  // DB table name
        // Data model: Event mapped --> to DB table events
    });

    Event.associate = function(models) {
        Event.hasMany(models.EventEmail, {
            foreignKey: 'eventId',
            as: 'emails'
        });
    };

    return Event;
    // Return Data model Event to allow index.js to sequelize and execute the DB
}
