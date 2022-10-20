const AlertRecord = require('../db/models/alertRecord');
const AdminDoor = require('../db/models/adminDoor');
const Door = require('../db/models/door');
const Statement = require('../db/models/statement');
const Admin = require('../db/models/admin');

const { getDate, getTime } = require('./time');

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

module.exports = {
    getAlertSuperDatas,
    getAlertDatas,
}