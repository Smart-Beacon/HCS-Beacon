//const Admin = require('../../db/models/admin');
const Door =  require('../db/models/door');
const Statement = require('../db/models/statement');
const AdminStatement = require('../db/models/adminStatement');
const AdminDoor = require('../db/models/adminDoor');
const Admin = require('../db/models/admin');
const SuperAdmin = require('../db/models/superAdmin');

const { getTimeSecond } = require('./time');
const { uuid } = require('./createUUID');


// 최고관리자 혹은 중간 관리자 이름 가져오는 함수
// isSuper 값으로 최고 관리자 혹은 중간 관리자를 나눔
const getAdminName = async(id,isSuper) =>{
    try{
        if(isSuper){
            const adminName = await SuperAdmin.findOne({
                where:{superId: id},
                attributes: ['superName']
            });
            return adminName['superName'];
        }else{
            const adminName = await Admin.findOne({
                where:{adminId: id},
                attributes: ['adminName']
            });
            return adminName['adminName'];
        }
        
    }catch(err){
        return err.message
    }
}

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
                        openTime: getTimeSecond(doorData.openTime),
                        closeTime: getTimeSecond(doorData.closeTime),
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
                        isOpen: doorData.isOpen,
                        isMonitoring: doorData.isMonitoring,
                        latestDate: doorData.latestDate,
                        openTime: getTimeSecond(doorData.openTime),
                        closeTime: getTimeSecond(doorData.closeTime),
                    }
                    return setData
                }));

            return setdDoorData
        })
    )

    const result = await doorDatas.flatMap(data => data);

    return result;
}

const getAdminDoorDatas = async(adminId) =>{
        
    const doorIds = await AdminDoor.findAll({
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
                openTime: getTimeSecond(doorData.openTime),
                closeTime: getTimeSecond(doorData.closeTime),
            };

            return result;
        })
    );

    return doorDatas
}

// POST : 새로운 출입문 등록 설정 함수
// 새로운 비콘 출입문을 등록하는 함수
// 담당관리자ID, 건물명, 건물ID, 도어명, 도어ID, 출입감시여부, 개방일시(요일선택, 날짜 선택, 개방시간, 폐쇄시간)
const createDoorData = async(data) =>{

    const exAdmin = await Admin.findOne({where:{adminLoginId:data.adminLoginId}});
    const exDoor = await Door.findOne({where:{doorId:data.doorId}});
    if(exAdmin && !exDoor){
        //exist Admin and Unregisted Door Id
        await Door.create({
            doorId: data.doorId,
            doorName: data.doorName,
            isMonitoring: data.isMonitoring,
            openWeeks: data.openWeeks,
            openDates: data.openDates,
            openTime: data.openTime,
            closeTime: data.closeTime,
            staId: data.staId
        });
    
        await AdminDoor.create({
            controlId: uuid(),
            doorId: data.doorId,
            adminId: exAdmin.adminId,
        });
    
        await AdminStatement.create({
            controlId: uuid(),
            staId: data.staId,
            adminId: exAdmin.adminId,
        });

        return true;
    }else{
        return false;
    }
}

const getAdminEmergency = async(adminId) => {
    const staIds = await AdminStatement.findAll({
        where: { adminId: adminId },
        attributes: ['staId']
    });

    let doorDatas = await Promise.all(
        staIds.map(async staId => {
            const doorDatas = await Door.findAll({
                where:{staId:staId.staId}
            })
            return doorDatas;
        })
    );
    
    doorDatas = await doorDatas.flatMap(data => data);

    const setData = await Promise.all(
        doorDatas.map(async doorData =>{

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

    return setData
}

const emergencyOpen = async(data) => {
    const door = await Door.findOne({where: { doorId:data.doorId }});
    door.isOpen = data.isOpen;
    await door.save();
    return door;
}

module.exports = {
    getAdminName,
    getAllDoorData,
    getAdminDoorDatas,
    getSuperDoorDatas,
    createDoorData,
    getAdminEmergency,
    emergencyOpen
}