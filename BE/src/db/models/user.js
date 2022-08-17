const Sequelize = require('sequelize');

class user extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                userId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                company: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userName: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                position: {
                    type: Sequelize.STRING(45),
                    allowNull: true,
                },
                phoneNum: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                userLoginId: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                    unique: true,
                },
                userLoginPw: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                userFlag: {
                    type: Sequelize.TINYINT,
                    allowNull: false,
                },
                reason: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                isAllowed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                workingTime: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
            },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'user',
                tableName: 'user',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.user.hasMany(db.accessRecord, {
            foreignKey: 'userId',
            sourceKey: 'userId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.user.hasMany(db.userAllow, {
            foreignKey: 'userId',
            sourceKey: 'userId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = user;