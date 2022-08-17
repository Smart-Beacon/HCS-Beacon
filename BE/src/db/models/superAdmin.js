const Sequelize = require('sequelize');

class superAdmin extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                superId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                superName: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                position: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                superLoginId: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                    unique: true,
                },
                superLoginPw: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                phoneNum: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
            },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'superAdmin',
                tableName: 'super_admin',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.superAdmin.hasMany(db.superControl, {
            foreignKey: 'superId',
            sourceKey: 'superId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = superAdmin;