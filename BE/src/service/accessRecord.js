const AccessRecord = require('../db/models/accessRecord');
const Door = require('../db/models/door');
const User = require('../db/models/user');
const Statement = require('../db/models/statement');
const AdminDoor = require('../db/models/adminDoor');
const Admin = require('../db/models/admin');

// GET : 출입문 입출이력
// 모든 출입문의 출입 기록을 확인하는 함수
// 최고 관리자만 사용하는 함수
// 건물명, 출입문 명, 도어ID, 출입자 성명, 날짜, 입실시간, 퇴실시간, 출입사유, 출입관리자
const getSuperAccessRecord = async() => {
    const allAccessRecord = await AccessRecord.findAll();
    const accessRecordList = await getAccessRecord(allAccessRecord);

    return accessRecordList;
}

// GET : 출입문 입출이력
// 특정 건물 출입문의 출입 기록을 확인하는 함수
// 중간 관리자만 사용하는 함수
// 건물명, 출입문 명, 도어ID, 출입자 성명, 날짜, 입실시간, 퇴실시간, 출입사유, 출입관리자
const getAdminAccessRecord = async(adminId) => {
    const doorIds = await AdminDoor.findAll({
        where:{ adminId },
        attributes:['doorId']
    });

    const findAccessRecord = await Promise.all(
        doorIds.map(async oneDoorId => {
            const accessRecord = await AccessRecord.findAll({
                where:{ doorId:oneDoorId.doorId }
            });
            return accessRecord;
        })
    );

    const adminAccessRecord = await findAccessRecord.flatMap(data => data);
    const accessRecordList = await getAccessRecord(adminAccessRecord);

    return accessRecordList;
}

const getAccessRecord = async (record) => {
    const accessRecordList = await Promise.all(
        record.map(async accessRecord => {

            const userData = await User.findOne({
                where: {userId:accessRecord.userId},
                attributes:['userName','reason']
            });

            const doorData = await Door.findOne({
                where: {doorId:accessRecord.doorId},
                attributes: ['staId','doorName']
            });

            const stateData = await Statement.findOne({
                where: {staId:doorData.staId},
                attributes: ['staName']
            });

            const adminId = await AdminDoor.findOne({
                where: {doorId: accessRecord.doorId},
                attributes: ['adminId']
            });

            const adminName = await Admin.findOne({
                where: {adminId: adminId.adminId},
                attributes: ['adminName']
            });

            const setAccessRecord = {
                staName: stateData.staName,
                doorName: doorData.doorName,
                doorId: accessRecord.doorId,
                userName: userData.userName,
                enterDate: accessRecord.enterDate,
                enterTime: accessRecord.enterTime,
                exitDate: accessRecord.exitDate,
                exitTime: accessRecord.exitTime,
                reason: userData.reason,
                adminName: adminName.adminName
            }

            return setAccessRecord;
        })
    );

    return accessRecordList;
}

module.exports = {
    getSuperAccessRecord,
    getAdminAccessRecord
}