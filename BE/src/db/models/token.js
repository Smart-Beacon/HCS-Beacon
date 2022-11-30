const Sequelize = require('sequelize');

class token extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            tokenId: {
                type:Sequelize.BIGINT.UNSIGNED,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            token: {
                type:Sequelize.STRING(6),
                allowNull: false,
            },
            createdAt:{
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'token',
            tableName: 'token',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.token.belongsTo(db.user, {
            foreignKey: 'userId',
            targetKey: 'userId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = token;