const SmsRecord = require('../db/models/smsRecord');
const AdminDoor = require('../db/models/adminDoor');
const Door = require('../db/models/door');
const Statement = require('../db/models/statement');
const Admin = require('../db/models/admin');

const { getDate, getTime } = require('./time');

const transData = async(doorIds,adminName) => {
    const result = await Promise.all(
        doorIds.map(async doorId => {
            const doorData = await Door.findOne({
                where: {doorId:doorId.doorId},
                attributes: ['staId','doorName'],
            });

            const staName = await Statement.findOne({
                where:{staId:doorData.staId},
                attributes:['staName']
            });

            const smsDatas = await SmsRecord.findAll({
                where:{doorId:doorId.doorId}
            });

            const resultRow = await Promise.all(
                smsDatas.map(async data => {
            
                    let smsDate =  getDate(data.sendTime);
                    let smsSendTime = getTime(data.sendTime);

                    const result = {
                        staName:staName.staName,
                        doorName:doorData.doorName,
                        doorId: doorId.doorId,
                        smsDate: smsDate,
                        smsSendTime: smsSendTime,
                        adminName: adminName,
                        isSend: data.isSend
                    };
                    return result
                })
            );
            return resultRow
        })
    );

    return result 
}

const getSuperSmsRecord = async() => {
    const admin = await Admin.findAll({
        attributes: ['adminId', 'adminName'],
    });

    const superDates = await Promise.all(
        admin.map(async adminData =>{
            const doorIds = await AdminDoor.findAll({
                where: {adminId:adminData.adminId},
                attributes: ['doorId'],
            });

            const doorDatas = transData(doorIds,adminData.adminName);
            return doorDatas.flatMap(data => data);
        })
    );
    const finalResult = superDates.flatMap(data => data);
    const sortedResult = finalResult.sort((a, b) => new Date(b.alertDate)-new Date(a.alertDate));
    
    return sortedResult;
}

const getAdminSmsRecord = async(id) => {

    const admin = await Admin.findOne({
        where:{adminId:id},
        attributes: ['adminName'],
    });

    const doorIds = await AdminDoor.findAll({
        where: {adminId:id},
        attributes: ['doorId'],
    });

    const doorDatas = transData(doorIds,admin.adminName);

    const finalResult = doorDatas.flatMap(data => data);
    const sortedResult = finalResult.sort((a, b) => new Date(b.alertDate)-new Date(a.alertDate));

    return sortedResult;
};

const sendSMS = async(data) =>{
    //문자 전송 함수
}

module.exports = {
    getSuperSmsRecord,
    getAdminSmsRecord,
    sendSMS
}