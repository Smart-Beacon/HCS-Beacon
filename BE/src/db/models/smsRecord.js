const Sequelize = require('sequelize');

class smsRecord extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                recordId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                sendTime: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                isSend: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
            },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'smsRecord',
                tableName: 'sms_record',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.smsRecord.belongsTo(db.door, {
            foreignKey: 'doorId',
            targetKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = smsRecord;