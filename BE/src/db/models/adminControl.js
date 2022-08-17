const Sequelize = require('sequelize');

class adminControl extends Sequelize.Model {

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
                modelName: 'adminControl',
                tableName: 'admin_control',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.adminControl.belongsTo(db.admin, {
            foreignKey: 'adminId',
            targetKey: 'adminId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.adminControl.belongsTo(db.door, {
            foreignKey: 'doorId',
            targetKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = adminControl;