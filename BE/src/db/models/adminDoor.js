const Sequelize = require('sequelize');

class adminDoor extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                controlId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
            },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'adminDoor',
                tableName: 'admin_door',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.adminDoor.belongsTo(db.admin, {
            foreignKey: 'adminId',
            targetKey: 'adminId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.adminDoor.belongsTo(db.door, {
            foreignKey: 'doorId',
            targetKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = adminDoor;