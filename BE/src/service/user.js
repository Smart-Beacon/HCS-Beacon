const Door = require('../db/models/door');
const AdminDoor = require('../db/models/adminDoor');
const User = require('../db/models/user');
const UserAllow = require('../db/models/userAllow');
const Statement = require('../db/models/statement');
const uuid = require('./createUUID');


// 최고관리자용 출입자 리스트 함수
// 사용 API : 출입자 관리 리스트 API
// 성명, 전화번호, 소속, 직책, 건물명, 출입문명, 방문일시, 방문허가
const getSuperEntrantList = async() => {
    const userIds = await User.findAll();

    const SuperUserAllows = await Promise.all(
        userIds.map(async userId => {
            const userAllow = await UserAllow.findAll({
                where:{ 
                    userId:userId.userId,
                    userFlag:{[Op.ne]:2}
                }
            });
            return userAllow;
        })
    );

    const UserAllows = SuperUserAllows.flatMap(data => data);
    const entrantList = await getEntrantList(UserAllows);

    return entrantList;
}

// 관리자용 출입자 리스트 함수
// 사용 API : 출입자 관리 리스트 API
// 성명, 전화번호, 소속, 직책, 건물명, 출입문명, 방문일시, 방문허가
const getAdminEntrantList = async(adminId) => {
    console.log(adminId);
    const doorIds = await AdminDoor.findAll({
        where:{ adminId },
        attributes:['doorId'],
    });

    const AdminUserAllows = await Promise.all(
        doorIds.map(async oneDoorId => {
            const userAllow = await UserAllow.findAll({
                where:{ 
                    doorId:oneDoorId.doorId,
                    userFlag:{[Op.ne]:2}
                }
            });
            return userAllow;
        })
    );

    const UserAllows = await AdminUserAllows.flatMap(data => data);
    console.log(UserAllows);
    const entrantList = await getEntrantList(UserAllows);

    return entrantList;
}

// 출입자(상시) 등록 함수
// 사용 API : 출입자(상시) 등록 API
const createRegularUserData = async(data) => {
    const exUser = await User.findOne({where:{userLoginId:data.userLoginId}});
    if(!exUser){
        const userData = await User.create({
            userId: await uuid.uuid(),
            userName: data.userName,
            company: data.company,
            position: data.position,
            phoneNum: data.phoneNum,
            userLoginId: data.userLoginId,
            userLoginPw: data.userLoginPw,
            reason: '상시 출입',
            enterTime: null,
            exitTime: null,
        });

        await Promise.all(
            data.doorList.map(async doorId =>{
                await UserAllow.create({
                    allowId: await uuid.uuid(),
                    userId: userData.userId,
                    doorId: doorId,
                    isAllowed: 1,
                    userFlag: 0,
                });
            })
        );

        return userData;
    }else{
        return null;
    }
}

// 최고 관리자용 방문자 예약 목록 리스트 함수
// 사용 API : 방문자 예약승인 리스트 API
const getSuperVisitorList = async() => {
    const SuperUserAllows = await UserAllow.findAll({
        where:{ userFlag:2 }
    });

    const UserAllows = SuperUserAllows.flatMap(data => data);
    const visitorList = await getVisitorList(UserAllows);

    return visitorList;
}

// 중간 관리자용 방문자 예약 목록 리스트 함수
// 사용 API : 방문자 예약승인 리스트 API
const getAdminVisitorList = async(adminId) => {
    const doorIds = await AdminDoor.findAll({
        where:{ adminId },
        attributes:['doorId'],
    });

    const AdminUserAllows = await Promise.all(
        doorIds.map(async oneDoorId => {
            const userAllow = await UserAllow.findAll({
                where:{ 
                    doorId:oneDoorId.doorId,
                    userFlag:2
                }
            });
            return userAllow;
        })
    );

    const UserAllows = await AdminUserAllows.flatMap(data => data);
    const visitorList = await getVisitorList(UserAllows);

    return visitorList;
}

// 방문자 예약 승인 변경
// 사용 API : 방문자 예약 승인여부 변경 API
const changeVisitorAllow = async(data) => {
    const allow = await UserAllow.findOne({
        where: {allowId: data.allowId}
    });
    allow.isAllowed = data.isAllowed;
    await allow.save();
    return allow;
}

// 출입자 리스트 함수
// 매개변수 : 출입 허용 목록(UserAllow)
// 리턴값 : 출입자 목록(사용자 정보, 건물명, 출입문 명)
// 사용함수
//  getSuperEntrantList
//  getAdminEntrantList
const getEntrantList = async(allows) => {
    const entrantList = await Promise.all(
        allows.map(async allowData => {
            const userDatas = await User.findAll({
                where: {userId:allowData.userId},
                attributes: ['userId','userName','company','position','phoneNum','reason','enterTime','exitTime']
            });

            const setUserData = await Promise.all(
                userDatas.map(async userData => {

                    const doorData = await Door.findOne({
                        where: {doorId:allowData.doorId},
                        attributes:['doorName', 'staId']
                    });

                    const stateData = await Statement.findOne({
                        where: {staId:doorData.staId}
                    })

                    const setData = {
                        userFlag: allowData.userFlag,
                        userName: userData.userName,
                        company: userData.company,
                        position: userData.position,
                        phoneNum: userData.phoneNum,
                        staName: stateData.staName,
                        doorName: doorData.doorName,
                        enterTime: userData.enterTime,
                        exitTime: userData.exitTime,
                        reason: userData.reason,
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

// 방문자 리스트 함수
// 매개변수 : 출입 허용 목록(UserAllow)
// 리턴값 : 방문자 목록(사용자 정보, 건물명, 출입문 명)
// 사용함수
//  getSuperVisitorList
//  getAdminVisitorList
const getVisitorList = async(allows) => {
    const entrantList = await Promise.all(
        allows.map(async allowData => {
            const userDatas = await User.findAll({
                where: {userId:allowData.userId},
                attributes: ['userId','userName','company','position','phoneNum','reason','enterTime','exitTime']
            });

            const setUserData = await Promise.all(
                userDatas.map(async userData => {

                    const doorData = await Door.findOne({
                        where: {doorId:allowData.doorId},
                        attributes:['doorName', 'staId']
                    });

                    const stateData = await Statement.findOne({
                        where: {staId:doorData.staId}
                    })

                    const setData = {
                        allowId: allowData.allowId,
                        userFlag: allowData.userFlag,
                        userName: userData.userName,
                        company: userData.company,
                        position: userData.position,
                        phoneNum: userData.phoneNum,
                        staName: stateData.staName,
                        doorName: doorData.doorName,
                        enterTime: userData.enterTime,
                        exitTime: userData.exitTime,
                        reason: userData.reason,
                        isAllowed: allowData.isAllowed,
                    }
                    return setData;
                }));

            return setUserData;
        })
    );
    const result = await entrantList.flatMap(data => data);
    return result;
}

// 예약 방문자 등록 함수
// 사용 API : 유저 방문 등록 API
const registUser = async(userInfo) => {

    const exUser = await User.findOne({
        where:{
            phoneNum:userInfo.phoneNum,
            userName:userInfo.name
        }
    });

    if(exUser){
        console.log('유저 확인');
        await User.update({
            reason: userInfo.reason,
            enterTime: userInfo.enterTime,
            exitTime: userInfo.exitTime
        },{where:{
            phoneNum:userInfo.phoneNum,
            userName:userInfo.name
        }});

        return 200
    }else{
        console.log('유저 없음');
        console.log(userInfo);
        await User.create({
            userId: await uuid.uuid(),
            userName: userInfo.name,
            company: userInfo.company,
            position: userInfo.position,
            phoneNum: userInfo.phoneNum,
            userLoginId: userInfo.phoneNum.replace(/-/g,''),
            userLoginPw: '1234',//userInfo.name,
            reason: userInfo.reason,
            enterTime: Date.parse(userInfo.enterTime),
            exitTime: Date.parse(userInfo.exitTime)
        });
        return 201
    }
}

// 모든 방문자 ID 체킹
// 사용 API : 유저 아이디 찾기 API
const findUserId = async(user) => {
    const exUser = await User.findOne({
        where:{
            userName:user.name,
            phoneNum:user.phoneNum,
        }
    });

    if(exUser){
        //임시 인증번호 만들기
        return exUser.userId;
    }else{
        return null;
    }
}

// 모든 방문자 PW 찾기
// 사용 API : 유저 PW 찾기 API
const findUserPw = async(user) => {
    const exUser = await User.findOne({
        where:{
            userLoginId: user.loginId,
            userName: user.name,
            phoneNum: user.phoneNum,
        }
    });

    if(exUser){
        //임시 인증번호 만들기
        return exUser.userId;
    }else{
        return null;
    }
    
}

const createToken = async(user) =>{
    
}

const checkToken = async(user) =>{
}

module.exports = {
    getSuperEntrantList,
    getAdminEntrantList,
    createRegularUserData,
    getSuperVisitorList,
    getAdminVisitorList,
    changeVisitorAllow,
    registUser,
    findUserId,
    findUserPw,
}