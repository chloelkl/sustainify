module.exports = (sequelize, DataTypes) => {
    const BackupHistory = sequelize.define("BackupHistory", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        filePath: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'backup_history'
    });

    return BackupHistory;
};
