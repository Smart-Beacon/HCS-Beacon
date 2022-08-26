const Sequelize = require('sequelize');

class statement extends Sequelize.Model {

    // 스태틱 메소드
    // 테이블에 대한 설정
    static init(sequelize) {
        return super.init({  // 첫번째 객체 인수는 테이블 필드에 대한 설정
                staId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    primaryKey: true,
                },
                staName: {
                    type: Sequelize.STRING(45),
                    allowNull: false,
                },
            },{  // 두번째 객체 인수는 테이블 자체에 대한 설정
                sequelize,              /* static init 메서드의 매개변수와 연결되는 옵션으로, db.sequelize 객체를 넣어야 한다. */
                timestamps: false,      /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */
                underscored: false,     /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */
                modelName: 'statement', /* 모델 이름을 설정. */
                tableName: 'statement', /* 데이터베이스의 테이블 이름. */
                paranoid: false,        /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */
                charset: 'utf8',        /* 인코딩 */
                collate: 'utf8_general_ci',
            });
    }

    static associate(db) {
        db.statement.hasMany(db.door, {
            foreignKey: 'staId',
            sourceKey: 'staId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        db.statement.hasMany(db.adminStatement, {
            foreignKey: 'staId',
            sourceKey: 'staId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};

module.exports = statement;