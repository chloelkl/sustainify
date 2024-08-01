module.exports = (sequelize, DataTypes) => {
    const SentEmail = sequelize.define("SentEmail", {
        emailID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        senderEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        recipientEmails: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        sentAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    return SentEmail;
};
