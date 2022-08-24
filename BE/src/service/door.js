//const Admin = require('../../db/models/admin');
const Door =  require('../db/models/door');
const AdminDoor = require('../db/models/adminDoor');
const Statement = require('../db/models/statement');


const getDoorDatas = async(adminId) =>{
        
    const doorIds = await AdminDoor.findAll({
        where:{ adminId },
        include: ['doorId'],
    });

    const doorDatas = await Promise.all(
        doorIds.map(async doorId =>{
            const doorData = await Door.findOne({
                where:{ doorId: doorId}
            });

            const statmentName = await Statement.findOne({
                where:{staId:doorData.staId},
                include: ['staName'],
            });

            const result = {
                staName: statmentName,
                doorName: doorData.doorName,
                beaconId: doorData.beaconId,
                isOpen: doorData.isOpen,
                openTime: doorData.openTime,
                closeTime: doorData.closeTime,
                state: doorData.isWatch,
            };

            return result;
        })
    );

    return doorDatas
}

module.exports = {
    getDoorDatas
}
