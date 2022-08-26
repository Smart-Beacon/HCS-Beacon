const Admin = require('../db/models/admin');
const AdminDoor = require('../db/models/adminDoor');
const AdminStatment = require('../db/models/adminStatement');
const uuid  = require('./createUUID');

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

const createAdminData = async(data) => {
    const exAdmin = await Admin.findOne({where:{adminLoginId: data.adminLoginId}});
    if (!exAdmin){
        const adminData = await Admin.create({
            adminId: await uuid.uuid(),
            company: data.company,
            position: data.position,
            adminName: data.adminName,
            phoneNum: data.phoneNum,
            adminLoginId: data.adminLoginId,
            adminLoginPw: data.adminLoginPw,
            sms: data.sms,
        });
        
        let doorList = data.doorlist;

        await AdminStatment.create({
            controlId: await uuid.uuid(),
            staId: data.staId,
            adminId: adminData.adminId
        });

        await Promise.all(
            doorList.map(async doorId =>{
                await AdminDoor.create({
                    controlId: await uuid.uuid(),
                    doorId: doorId,
                    adminId: adminData.adminId
                });
            })
        );

        return adminData;
    }else{
        return null;
    }
    
};


module.exports = {
    getAdminData,
    createAdminData
}
