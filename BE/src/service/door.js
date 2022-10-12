//const Admin = require('../../db/models/admin');
const Door =  require('../db/models/door');
const Statement = require('../db/models/statement');
const AdminStatement = require('../db/models/adminStatement');
const AdminDoor = require('../db/models/adminDoor');
const Admin = require('../db/models/admin');
const SuperAdmin = require('../db/models/superAdmin');
const uuid = require('./createUUID');
const time = require('./time');

const WEEKDAY = {
    "일요일":0,
    "월요일":1,
    "화요일":2,
    "수요일":3,
    "목요일":4,
    "금요일":5,
    "토요일":6
}


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
                        isOpen: doorData.isOpen,
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

const getAdminDoorDatas = async(adminId) =>{
        
    const doorIds = await AdminDoor.findAll({
        where:{ adminId },
        attributes:['doorId'],
    });

    const doorDatas = await Promise.all(
        doorIds.map(async doorId =>{
            console.log(doorId);
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

// POST : 새로운 출입문 등록 설정 함수
// 새로운 비콘 출입문을 등록하는 함수
// 담당관리자ID, 건물명, 건물ID, 도어명, 도어ID, 출입감시여부, 개방일시(요일선택, 날짜 선택, 개방시간, 폐쇄시간)
const createDoorData = async(data) =>{
    console.log(data);
    const exAdmin = await Admin.findOne({where:{adminLoginId:data.adminLoginId}});
    const exDoor = await Door.findOne({where:{doorId:data.doorId}});
    if(exAdmin && !exDoor){
        let daysWeek = await Promise.all(data.openWeeks.map(async day =>{
            return WEEKDAY[day];
        }));
        //exist Admin and Unregisted Door Id
        await Door.create({
            doorId: data.doorId,
            doorName: data.doorName,
            isMonitoring: data.isMonitoring,
            openWeeks: String(daysWeek),
            openDates: time.getDateHipon(new Date(data.openDates)),
            openTime: data.openTime,
            closeTime: data.closeTime,
            staId: data.staId
        });
    
        await AdminDoor.create({
            controlId: uuid.uuid(),
            doorId: data.doorId,
            adminId: exAdmin.adminId,
        });
        
        await AdminStatement.findOrCreate({
            where: { staId: data.staId, adminId: exAdmin.adminId },
            defaults:{
                controlId: uuid.uuid(),    
            }
        });

        return true;
    }else{
        return false;
    }
}

//GET : (최고관리자) 비상 도어 정보 리스트 반환 함수
// 모든 도어를 위급 상황 시 열기 위해 도어 정보들을 리턴해주는 함수
// 건물명, 도어명, 도어ID, 개방여부
const getSuperEmergency = async() => {
    const doorDatas = await Door.findAll({
        attributes: ['doorId', 'staId', 'doorName', 'isOpen']
    });

    const setData = await Promise.all(
        doorDatas.map(async doorData => {

            const statementName = await Statement.findOne({
                where:{staId:doorData.staId},
                attributes:['staName'],
            });

            const result = {
                staName: statementName.staName,
                doorName: doorData.doorName,
                doorId: doorData.doorId,
                isOpen: doorData.isOpen,
            };

            return result;
        })
    );

    return setData;
}

//GET : (중간관리자) 비상 도어 정보 리스트 반환 함수
// 자신이 담당하는 도어들을 위급 상황 시 열기 위해 도어 정보들을 리턴해주는 함수
// 건물명, 도어명, 도어ID, 개방여부
const getAdminEmergency = async(adminId) => {
    const staIds = await AdminStatement.findAll({
        where: { adminId: adminId },
        attributes: ['staId'],
        include:[{
            model:Statement,
        }],
    });
    const buildingInfo = staIds.flatMap(data=>data.statement);

    const result = await Promise.all(
        buildingInfo.map(async building => {
            const doorDatas = await Door.findAll({
                where:{staId:building.staId},
                attributes: ['doorId', 'doorName', 'isOpen'],
                include:[{
                    model:Statement,
                    attributes:['staName'],
                    required: false,
                }],
                raw: true,
            });
            return doorDatas;
        })
    );

    const newResult = result.flatMap(data => data).map(door =>{
            return{ staName:door["statement.staName"], doorId: door.doorId, doorName:door.doorName, isOpen:door.isOpen}
    });
    console.log(newResult);
    return newResult;
}

//POST : 비상 도어 개방 함수
// 관리자로부터 받은 도어 정보를 받아 즉시 열어주는 함수
// 도어ID, 개방여부
const emergencyOpen = async(doorOpen, io) => {
    console.log(doorOpen);
    const doorResult = await Promise.all(doorOpen.map(async door =>{
        const exDoor = await Door.findOne({where: { doorId:door.doorId },attributes:['doorId','isOpen','socketId']});
        if(exDoor){
            if(door.isOpen){
                io.to(exDoor.socketId).emit("open",{isOpen:true, duration:1000*60*60*24});  //ms단위로 24시간 열림
            }else{
                io.to(exDoor.socketId).emit("close",{isOpen:false}); // 도어 닫음
            }
            exDoor.isOpen = door.isOpen;
            await exDoor.save();
        }
        return exDoor;
    }));
    return doorResult;
}

module.exports = {
    getAdminName,
    getAllDoorData,
    getAdminDoorDatas,
    getSuperDoorDatas,
    createDoorData,
    getSuperEmergency,
    getAdminEmergency,
    emergencyOpen
}