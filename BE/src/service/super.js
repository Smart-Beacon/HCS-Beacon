//  ▼ BE/src/db/models 에 위치한 모델 파일을 각각 클래스 형태로 불러온다.
const Admin = require('../db/models/admin');
const AdminDoor = require('../db/models/adminDoor');
const AdminStatment = require('../db/models/adminStatement');

/*
    ▼ BE/src/service/createUUID에 위치한 메소드들을 불러온다.
    ▼ BE/src/service/time에 위치한 메소드들을 불러온다.
*/
const uuid = require('./createUUID');
const time = require('./time');


/*
    ▼ 중간관리자의 모든 정보를 리턴하는 함수
    - 모든 중간 관리자의 이름, 로그인 Id, 회사, 전화번호, 
    등록일자, 로그인 유무, sms수신 여부의 정보를 리턴한다.
*/
const getAdminData = async() =>{
    const adminDatas = await Admin.findAll();

    const result = await Promise.all(
        adminDatas.map(async admin =>{
            const datas = {
                company: admin.company,
                adminName: admin.adminName,
                adminLoginId: admin.adminLoginId,
                phoneNum: admin.phoneNum,
                createdAt: admin.createdAt,
                isLogin: admin.isLogin,
                sms: admin.sms
            };
            return datas;
        })
    );

    return result;
};


/*
    ▼ 중간관리자를 등록하는 함수
    - 클라이언트에서 보낸 데이터를 가지고 관리자를 새로 만드는 함수.
    - 로그인 Id가 중복되는지 체크한 후, 중복되지 않았다면, 현재 시간을 측정하여 등록일자로 등록
    - 관리자의 개인 정보(클라이언트가 보낸 데이터)를 새로 등록한다.
    - 새로 등록된 관리자가 관리해야할 건물 및 출입문들을 설정해준다.
    - 그대로 DB에 저장한다.
    - 이후 새로 만들어진 관리자의 정보를 클라이언트에게 다시 보내 응답이 제대로 이루어졌음을 알린다.
*/
const createAdminData = async(data) => {
    console.log(data);
    const exAdmin = await Admin.findOne({where:{adminLoginId: data.adminLoginId}});
    if (!exAdmin){
        let nowTime = new Date();
        nowTime.setHours(nowTime.getHours()+9);

        const adminData = await Admin.create({
            adminId: await uuid.uuid(),
            company: data.company,
            position: data.position,
            adminName: data.adminName,
            phoneNum: data.phoneNum,
            adminLoginId: data.adminLoginId,
            adminLoginPw: data.adminLoginPw,
            createdAt: time.getDateHipon(nowTime),
            sms: data.sms,
        });
        
        
        let staIds = data.staId;
        await Promise.all(
            staIds.map(async staId =>{
                await AdminStatment.create({
                    controlId: await uuid.uuid(),
                    staId: staId,
                    adminId: adminData.adminId
                });
            })
        );

        let doorList = data.doorlist;
        await Promise.all(
            doorList.map(async doorId =>{
                await AdminDoor.create({
                    controlId: await uuid.uuid(),
                    doorId: doorId,
                    adminId: adminData.adminId
                });
            })
        );

        const result = {
            company: adminData.company,
            position: adminData.position,
            adminName: adminData.adminName,
            phoneNum: adminData.phoneNum,
            adminLoginId: adminData.adminLoginId,
            createdAt: adminData.createdAt,
            sms: adminData.sms,
            isLogin: adminData.isLogin,
        }

        return result;
    }else{
        return null;
    }
    
};

//외부에서 사용할 수 있게 내보내기
module.exports = {
    getAdminData,
    createAdminData
}
