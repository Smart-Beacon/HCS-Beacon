// ▼ BE/src/db/models 에 위치한 모델 파일을 각각 클래스 형태로 불러온다.
const Door =  require('../db/models/door');
const Statement = require('../db/models/statement');
const AdminStatement = require('../db/models/adminStatement');
const AdminDoor = require('../db/models/adminDoor');

/*
    ▼ 모든 건물의 정보를 리턴하는 함수
    - 모든 건물의 ID와 건물 이름을 리턴하는 함수
*/
const getStatementOfSuper = async() => {
    const result = await Statement.findAll({
        attributes:['staId','staName']
    });

    return result;
};


/*
    ▼ 모든 출입문의 정보를 리턴하는 함수
    - 모든 출입문의 ID와 출입문 이름, 건물Id를 리턴하는 함수
*/
const getDoorOfSuper = async() => {
    const doorData = await Door.findAll({
        attributes:['doorId','doorName','staId']
    });

    return doorData;
}

/*
    ▼ 중간 관리자가 관리하는 모든 건물의 정보를 리턴하는 함수
    - 중간 관리자가 관리하는 모든 출입문의 Id와 출입문 이름, 건물Id를 리턴하는 함수
    - 중간 관리자가 관리하는 모든 건물의 Id를 가져온다.
    - 해당 건물 Id들을 통해 출입문의 Id와 출입문 이름, 건물 Id를 리턴한다.
*/
const getStatementOfAdmin = async(id) => {
    const staIds = await AdminStatement.findAll({
        where:{adminId:id},
        attributes:['staId']
    });

    const result = Promise.all(
        staIds.map(async staId => {
            const staData = await Statement.findOne({
                where:{staId:staId.staId},
                attributes:['staId','staName']
            });
            return staData;
        })
    );
    
    return result;
};


/*
    ▼ 중간 관리자가 관리하는 모든 출입문의 정보를 리턴하는 함수
    - 중간 관리자가 관리하는 모든 출입문의 Id와 출입문 이름, 건물Id를 리턴하는 함수
    - 중간 관리자가 관리하는 모든 출입문의 Id를 가져온다.
    - 해당 출입문 Id들을 통해 출입문의 Id와 출입문 이름, 건물 Id를 리턴한다.
*/
const getDoorOfAdmin = async(id) => {
    const doorIds = await AdminDoor.findAll({
        where:{adminId:id},
        attributes:['doorId']
    });

    const result = Promise.all(
        doorIds.map(async doorId => {
            const doorData = await Door.findOne({
                where:{doorId:doorId.doorId},
                attributes:['doorId','doorName','staId']
            });

            return doorData;
        })
    );

    return result;
}

//외부에서 사용할 수 있게 내보내기
module.exports = {
    getStatementOfSuper,
    getStatementOfAdmin,
    getDoorOfSuper,
    getDoorOfAdmin,
}
