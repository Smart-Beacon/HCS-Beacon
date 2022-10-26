const Sequelize = require('sequelize');

class accessRecord extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                recordId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                enterDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                enterTime: {
                    type: Sequelize.TIME,
                    allowNull: false,
                },
                exitDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: true,
                },
                exitTime: {
                    type: Sequelize.TIME,
                    allowNull: true,
                },
            },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'accessRecord',
                tableName: 'access_record',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.accessRecord.belongsTo(db.user, {
            foreignKey: 'userId',
            targetKey: 'userId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.accessRecord.belongsTo(db.door, {
            foreignKey: 'doorId',
            targetKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = accessRecord;