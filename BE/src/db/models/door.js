const Sequelize = require('sequelize');

class door extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                doorId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                doorName: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                isOpen: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                isWatch: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                openTime: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                closeTime: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
            },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'door',
                tableName: 'door',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.door.belongsTo(db.statement, {
            foreignKey: 'staId',
            targetKey: 'staId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.door.hasMany(db.accessRecord, {
            foreignKey: 'doorId',
            sourceKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.door.hasMany(db.superControl, {
            foreignKey: 'doorId',
            sourceKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.door.hasMany(db.adminControl, {
            foreignKey: 'doorId',
            sourceKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.door.hasMany(db.userAllow, {
            foreignKey: 'doorId',
            sourceKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = door;