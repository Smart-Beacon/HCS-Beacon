const Sequelize = require('sequelize');

class adminStatement extends Sequelize.Model {

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
                modelName: 'adminStatement',
                tableName: 'admin_statement',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.adminStatement.belongsTo(db.admin, {
            foreignKey: 'adminId',
            targetKey: 'adminId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.adminStatement.belongsTo(db.statement, {
            foreignKey: 'staId',
            targetKey: 'staId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = adminStatement;