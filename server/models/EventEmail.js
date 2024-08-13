module.exports = (sequelize, DataTypes) => {
    const EventEmail = sequelize.define("EventEmail", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'events', 
                key: 'id'
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'sent'
        },
        sentAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    return EventEmail;
};
