const Sequelize = require('sequelize');

class userAllow extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
                allowId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                userFlag: {
                    type: Sequelize.TINYINT,
                    allowNull: false,
                },
                isAllowed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                    defaultValue: null,
                },
            },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'userAllow',
                tableName: 'user_allow',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.userAllow.belongsTo(db.user, {
            foreignKey: 'userId',
            targetKey: 'userId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.userAllow.belongsTo(db.door, {
            foreignKey: 'doorId',
            targetKey: 'doorId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = userAllow;