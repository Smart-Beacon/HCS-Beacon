const Sequelize = require('sequelize');

class statement extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                staId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                staName: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
            },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'statement',
                tableName: 'statement',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.statement.belongsTo(db.facility, {
            foreignKey: 'facId',
            targetKey: 'facId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.statement.hasMany(db.door, {
            foreignKey: 'staId',
            sourceKey: 'staId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = statement;