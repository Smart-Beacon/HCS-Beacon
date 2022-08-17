const Sequelize = require('sequelize');

class superControl extends Sequelize.Model {

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
                modelName: 'superControl',
                tableName: 'super_control',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.superControl.belongsTo(db.superAdmin, {
            foreignKey: 'superId',
            targetKey: 'superId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.superControl.belongsTo(db.door, {
            foreignKey: 'doorId',
            targetKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = superControl;