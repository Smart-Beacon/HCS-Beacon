const Sequelize = require('sequelize');

class admin extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                adminId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                adminName: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                position: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                adminLoginId: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                    unique: true,
                },
                adminLoginPw: {
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
                modelName: 'admin',
                tableName: 'admin',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.admin.hasMany(db.adminControl, {
            foreignKey: 'adminId',
            sourceKey: 'adminId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = admin;