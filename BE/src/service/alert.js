//  ▼ BE/src/db/models 에 위치한 모델 파일을 각각 클래스 형태로 불러온다.
const AlertRecord = require('../db/models/alertRecord');
const AdminDoor = require('../db/models/adminDoor');
const Door = require('../db/models/door');
const Statement = require('../db/models/statement');
const Admin = require('../db/models/admin');

//  ▼ BE/src/service/time에 위치한 메소드들을 불러온다.
const { getDate, getTime } = require('./time');


/*
    ▼ 모든 경보 이력 데이터를 리턴해주는 함수
    - 최고 관리자에게 모든 출입문의 경보 이력을 보여주는 함수이다.
    - 경보 이력의 모든 데이터들을 조회한 후, 경보가 발생한 출입문의 관리자들의 이름을 뽑아낸다.
    - 경보가 발생한 시간, 경보가 발생한 출입문 이름, 건물 이름, BeaconID, 관리자 이름을 JSon 형태로 변환
    - 변환된 json 형식의 데이터를 반환한다.
*/
const getAlertSuperDatas = async() => {
    const alertRecord = await AlertRecord.findAll({
        include: {
            model: Door,
            attributes:['doorName','doorId','staId']
        }
    });

    const result2 = await Promise.all(
        alertRecord.map(async record => {
            const AdminDoorData = await AdminDoor.findOne({
                where: {doorId:record.door.doorId},
                attributes: ['adminId'],
            });

            const adminData = await Admin.findOne({
                where:{adminId:AdminDoorData.adminId},
                attributes:['adminName']
            });
            const statement = await Statement.findOne({where:{staId:record.door.staId}});
            
            console.log(record.startTime);
            let alertDate = getDate(record.startTime);
            let alertStartTime = getTime(record.startTime);
            let alertEndTime = '';
            if(record.endTime){
                alertEndTime = getTime(record.endTime);
            }
            

            const result = {
                staName : statement.staName,
                doorName: record.door.doorName,
                doorId: record.door.doorId,
                alertDate: alertDate,
                alertTime: alertStartTime + '/' + alertEndTime,
                adminName: adminData.adminName
            }

            return result;
        }));
    const finalResult = result2.flatMap(data => data);
    const sortedResult = finalResult.sort((a, b) => new Date(b.alertDate)-new Date(a.alertDate));
        
    return sortedResult;
}


/*
    ▼ 관리하는 출입문의 경보 이력만 리턴해주는 함수
    - 중간 관리자에게 자신이 관리하는 출입문의 경보 이력을 보여주는 함수이다.
    - 중간 관리자가 관리하는 출입문을 모두 조회한 후, 경보가 발생한 출입문의 데이터만 뽑아낸다.
    - 경보가 발생한 시간, 경보가 발생한 출입문 이름, 건물 이름, BeaconID, 관리자 이름을 JSon 형태로 변환
    - 변환된 json 형식의 데이터를 반환한다.
*/
const getAlertDatas = async(id) => {
    const adminDoorData = await AdminDoor.findAll({
        include:[{
            model:Admin,
            attributes:['adminName']
        },{
            model:Door,
            attributes:['doorName','staId']
        }],
        where: {adminId:id},
        attributes: ['doorId'],
    });

    const result2 = await Promise.all(
        adminDoorData.map(async adminDoor => {
            const alertRecord = await AlertRecord.findAll({
                where:{doorId:adminDoor.doorId}
            });

            const statement = await Statement.findOne({
                where: {staId:adminDoor.door.staId},
                attributes: ['staName'],
            });

            const alertRecords = await Promise.all(
                alertRecord.map(async record =>{
                    console.log(record);
                    let alertDate = getDate(record.startTime);
                    let alertStartTime = getTime(record.startTime);
                    let alertEndTime = getTime(record.endTime);

                    const result = {
                        staName: statement.staName,
                        doorName: adminDoor.door.doorName,
                        doorId: adminDoor.doorId,
                        alertDate: alertDate,
                        alertTime: alertStartTime + '/' + alertEndTime,
                        adminName: adminDoor.admin.adminName
                    }
                    return result;
                })
            )

            return alertRecords;
        }));

    return result2.flatMap(data => data);
};

//외부에서 사용할 수 있게 내보내기
module.exports = {
    getAlertSuperDatas,
    getAlertDatas,
}