const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const saltRounds = 10;

class admin extends Sequelize.Model {
    // generateToken() {
    //     const token = jwt.sign({
    //         adminId: this.adminId,
    //         adminLoginId: this.adminLoginId,
    //     },process.env.JWT_SECRET,{
    //         expiresIn: '7d',
    //     },);
    //     return token;
    // }

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
                company: {
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
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    set(value) {
                        this.setDataValue('adminLoginPw', bcrypt.hashSync(value, saltRounds));
                    },
                },
                createdAt: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                phoneNum: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
                isLogin: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                sms: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
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
        db.admin.hasMany(db.adminStatement, {
            foreignKey: 'adminId',
            sourceKey: 'adminId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.admin.hasMany(db.adminDoor, {
            foreignKey: 'adminId',
            sourceKey: 'adminId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = admin;