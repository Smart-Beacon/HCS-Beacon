const Admin = require('../db/models/admin');
const AdminDoor = require('../db/models/adminDoor');
const AdminStatment = require('../db/models/adminStatement');

const uuid = require('./createUUID');
const time = require('./time');

// GET : 출입 관리자 리스트 함수
// 모든 중간 관리자들의 정보를 리스트화 하여 보여주는 함수
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

// POST : 출입 관리자 등록 함수
// 관리할 건물 및 도어를 선택한 후 관리자를 생성하는 함수
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


module.exports = {
    getAdminData,
    createAdminData
}
