const Door =  require('../db/models/door');
const Statement = require('../db/models/statement');
const AdminStatement = require('../db/models/adminStatement');
const AdminDoor = require('../db/models/adminDoor');

// GET : 실시간 관리 현황 데이터
// 모든 건물에 있는 도어들의 데이터들을 확인하는 함수
// 최고 관리자 및 중간 관리자 모두 사용하는 함수
// 건물명, 출입문 명 ID, 현재상태, 개방시간, 폐쇄시간, 경보상태
const getAllDoorData = async() =>{
    const stateIds = await Statement.findAll();

    const doorDatas = await Promise.all(
        stateIds.map(async stateData => {
            const doorIds = await Door.findAll({
                where: {staId:stateData.staId},
                attributes: ['doorId','doorName','isOpen','warning','openTime','closeTime']
            });

            const setdDoorData = await Promise.all(
                doorIds.map(async doorData =>{
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
                }));

            return setdDoorData
        })
    )

    const result = await doorDatas.flatMap(data => data);

    return result;
}

// GET : 출입문 관리 설정 데이터
// 모든 건물에 있는 도어들의 데이터들을 확인하는 함수
// 최고 관리자만 사용하는 함수
// 건물명, 출입문 명 ID, 현재상태, 출입관리, 날짜, 개방시간, 폐쇄시간
const getSuperDoorDatas = async() =>{
    const stateIds = await Statement.findAll();

    const doorDatas = await Promise.all(
        stateIds.map(async stateData => {
            const doorIds = await Door.findAll({
                where: {staId:stateData.staId},
                attributes: ['doorId','doorName','isOpen','isMonitoring','latestDate','openTime','closeTime']
            });

            const setdDoorData = await Promise.all(
                doorIds.map(async doorData =>{
                    const setData = {
                        staName: stateData.staName,
                        doorName: doorData.doorName,
                        doorId: doorData.doorId,
                        isMonitoring: doorData.isMonitoring,
                        latestDate: doorData.latestDate,
                        openTime: doorData.openTime,
                        closeTime: doorData.closeTime,
                    }
                    return setData
                }));

            return setdDoorData
        })
    )

    const result = await doorDatas.flatMap(data => data);

    return result;
}

// GET : 출입문 관리 설정 데이터
// 모든 건물에 있는 도어들의 데이터들을 확인하는 함수
// 중간 관리자만 사용하는 함수
// 건물명, 출입문 명 ID, 현재상태, 출입관리, 날짜, 개방시간, 폐쇄시간
const getAdminDoorDatas = async(adminId) =>{
    const doorIds = await  AdminDoor.findAll({
        where:{ adminId },
        attributes:['doorId'],
    });

    const doorDatas = await Promise.all(
        doorIds.map(async doorId =>{

            const doorData = await Door.findOne({
                where:{doorId:doorId.doorId}
            });

            const statmentName = await Statement.findOne({
                where:{staId:doorData.staId},
                attributes: ['staName'],
            });

            const result = {
                staName: statmentName.staName,
                doorName: doorData.doorName,
                doorId: doorData.doorId,
                isOpen: doorData.isOpen,
                isMonitoring: doorData.isMonitoring,
                latestDate: doorData.latestDate,
                openTime: doorData.openTime,
                closeTime: doorData.closeTime,
                
            };

            return result;
        })
    );

    return doorDatas
}

module.exports = {
    getAllDoorData,
    getAdminDoorDatas,
    getSuperDoorDatas,
}
