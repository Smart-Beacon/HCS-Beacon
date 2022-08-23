const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const saltRounds = 10;

class superAdmin extends Sequelize.Model {
    // generateToken() {
    //     const token = jwt.sign({
    //         superId: this.superId,
    //         superLoginId: this.superLoginId,
    //     },process.env.JWT_SECRET,{
    //         expiresIn: '7d',
    //     },);
    //     return token;
    // }

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
                    set(value) {
                        this.setDataValue('superLoginPw', bcrypt.hashSync(value, saltRounds));
                    },
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
};

module.exports = superAdmin;