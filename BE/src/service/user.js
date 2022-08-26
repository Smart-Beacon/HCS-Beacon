const Door = require('../db/models/door');
const AdminDoor = require('../db/models/adminDoor');
const User = require('../db/models/user');
const UserAllow = require('../db/models/userAllow');
const Statement = require('../db/models/statement');

const { v4 } = require('uuid');

const uuid = () => {
    const tokens = v4().split('-');
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
}

// GET : 출입자 관리 데이터
// 모든 건물의 출입자 데이터를 확인하는 함수
// 최고 관리자만 사용하는 함수
// 성명, 전화번호, 소속, 직책, 건물명, 출입문명, 방문일시, 방문허가
const getSuperEntrantList = async() => {
    const allUserAllows = await UserAllow.findAll();
    const entrantList = await getEntrantList(allUserAllows);

    return entrantList;
}

// GET : 출입자 관리 데이터
// 담당 건물의 출입자 데이터만 확인하는 함수
// 중간 관리자만 사용하는 함수
// 성명, 전화번호, 소속, 직책, 건물명, 출입문명, 방문일시, 방문허가
const getAdminEntrantList = async(adminId) => {
    const doorIds = await AdminDoor.findAll({
        where:{ adminId },
        attributes:['doorId'],
    });

    const AdminUserAllows = await Promise.all(
        doorIds.map(async oneDoorId => {
            const userAllow = await UserAllow.findAll({
                where:{ doorId:oneDoorId.doorId }
            });
            return userAllow;
        }));

    const UserAllows = await AdminUserAllows.flatMap(data => data);
    const entrantList = await getEntrantList(UserAllows);

    return entrantList;
}

// POST : 출입자 등록
// 상시 출입자를 등록하는 함수
// 최고 관리자와 중간관리자 둘다 사용하는 함수
//
const createUserData = async(data) => {
    const exUser = await User.findOne({where:{userLoginId:data.userLoginId}});
    if(exUser){
        const userData = await User.create({
            userId: uuid(),
            userName: data.userName,
            company: data.company,
            position: data.position,
            phoneNum: data.phoneNum,
            userLoginId: data.userLoginId,
            userLoginPw: data.userLoginPw,
            userFlag: 0,
            reason: null,
            enterTime: null,
            exitTime: null,
        });

        let doorList = data.doorlist;

        await Promise.all(
            doorList.map(async doorId =>{
                await UserAllow.create({
                    allowId: uuid(),
                    userId: userData.userId,
                    doorId: doorId,
                    isAllowed: 1,
                });
            })
        );

        return userData;
    }else{
        return null;
    }
}

// 출입자 목록 변환 함수 getEntrantList
// 매개변수 : 출입 허용 목록(UserAllow)
// 리턴값 : 출입자 목록(사용자 정보, 건물명, 출입문 명)
// 이 함수를 사용하는 함수
//  getSuperEntrantList
//  getAdminEntrantList
const getEntrantList = async(allows) => {
    const entrantList = await Promise.all(
        allows.map(async allowData => {
            const userDatas = await User.findAll({
                where: {userId:allowData.userId},
                attributes: ['userId','userName','company','position','phoneNum','userFlag','enterTime','exitTime']
            });

            const setUserData = await Promise.all(
                userDatas.map(async userData => {

                    const doorData = await Door.findOne({
                        where: {doorId:allowData.doorId},
                    });

                    const stateData = await Statement.findOne({
                        where: {staId:doorData.staId}
                    })

                    const setData = {
                        userFlag: userData.userFlag,
                        userId: userData.userId,
                        userName: userData.userName,
                        company: userData.company,
                        position: userData.position,
                        phoneNum: userData.phoneNum,
                        staName: stateData.staName,
                        doorName: doorData.doorName,
                        enterTime: userData.enterTime,
                        exitTime: userData.exitTime,
                        isAllowed: allowData.isAllowed,
                    }
                    return setData;
                }));

            return setUserData;
        })
    )
    const result = await entrantList.flatMap(data => data);
    return result;
}

module.exports = {
    getSuperEntrantList,
    getAdminEntrantList,
    createUserData
}