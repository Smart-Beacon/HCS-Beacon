const Sequelize = require('sequelize');

class alertRecord extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                recordId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                startTime: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                endTime: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
            },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'alertRecord',
                tableName: 'alert_record',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.alertRecord.belongsTo(db.door, {
            foreignKey: 'doorId',
            targetKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = alertRecord;