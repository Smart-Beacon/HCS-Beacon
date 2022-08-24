//const Admin = require('../../db/models/admin');
const Door =  require('../db/models/door');

const Statement = require('../db/models/statement');
const AdminStatement = require('../db/models/adminStatement');

const getAllDoorData = async() =>{
    const stateIds = await Statement.findAll();

    //console.log(JSON.stringify(stateIds));

    const doorDatas = await Promise.all(
        stateIds.map(async stateData => {
            const doorIds = await Door.findAll({
                where: {staId:stateData.staId},
                attributes: ['doorId','doorName','isOpen','warning','openTime','closeTime']
            });

            //console.log(JSON.stringify(doorIds));

            const setdDoorData = doorIds.map(async doorData =>{
                const setData = {
                    staName: stateData.staName,
                    doorName: doorData.doorName,
                    doorId: doorData.doorId,
                    isOpen: doorData.isOpen,
                    openTime: doorData.openTime,
                    closeTime: doorData.closeTime,
                    warning: doorData.warning,
                }
                return setData
            })

            return setdDoorData
        })
    )
    
    const result = doorDatas.flatMap(data => data);

    return result;
}

const getDoorDatas = async(adminId) =>{
        
    const stateIds = await AdminStatement.findAll({
        where:{ adminId },
        attributes:['staId'],
    });

    const doorDatas = await Promise.all(
        stateIds.map(async stateId =>{
            const doorData = await Door.findAll({
                where:{staId:stateId}
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
    getAllDoorData,
    getDoorDatas
}
