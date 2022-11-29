//  ▼ BE/src/db/models 에 위치한 모델 파일을 각각 클래스 형태로 불러온다.
const Door = require('../db/models/door');
const AdminDoor = require('../db/models/adminDoor');
const User = require('../db/models/user');
const UserAllow = require('../db/models/userAllow');
const Statement = require('../db/models/statement');
const Token = require('../db/models/token');
const AccessRecord = require('../db/models/accessRecord');

//  ▼ BE/src/service/time에 위치한 메소드들을 불러온다.
//  ▼ BE/src/service/createUUID에 위치한 메소드들을 불러온다.
//  ▼ BE/src/service/sms에 위치한 메소드들을 불러온다.
const uuid = require('./createUUID');
const time = require('./time');
const {sendSMS} = require('./sms');

/*
    ▼ 최고 관리자용 출입자 리스트 함수
    - 모든 출입자들의 목록을 반환하는 함수
    - 성명, 전화번호, 소속, 직책, 건물명, 출입문명, 방문일시, 방문허가의 정보들을 반환한다.
*/
const getSuperEntrantList = async() => {
    const userInfoList = await User.findAll();

    const SuperUser = await Promise.all(
        userInfoList.map(async userInfo => {

            const userAllows = await UserAllow.findAll({
                where:{
                    userId:userInfo.userId,
                    isAllowed:true,
                },
                attributes:['userFlag','doorId']
            });
            
            const doorIds = userAllows.flatMap(data=>data.doorId);
            
            if(doorIds != [] && doorIds.length){
    
                const doorInfo = await Statement.findAll({
                    attributes:['staName'],
                    include:[{
                        model:Door,
                        where:{doorId:doorIds},
                        attributes:['doorName']
                    }]
                });
    
                const doorInfos = doorInfo.flatMap(data=>data.dataValues);
    
                const filterDoorInfos = await Promise.all(
                    doorInfos.map(async doors => {
                        const doorNames = doors.doors.flatMap(data=>data);
    
                        const doorList = await Promise.all(doorNames.map(async doorName =>{
                            return doorName.doorName
                        }));
    
                        return {
                            staName: doors.staName,
                            doorNameList: doorList,
                        };
                }));
    
                const result = {
                    userFlag: userAllows[0].userFlag,
                    userName: userInfo.userName,
                    company : userInfo.company,
                    position: userInfo.position,
                    phoneNum: userInfo.phoneNum,
                    doorInfo: filterDoorInfos.flatMap(data=>data),
                    enterTime: userInfo.enterTime,
                    exitTime:userInfo.exitTime,
                    reason: userInfo.reason
                };
                console.log(result);
                return result;
            }
        return null;
        })
    );
    const allUserData = SuperUser.filter(data => !!data);
    return allUserData;
}


/*
    ▼ 중간 관리자용 출입자 리스트 함수
    - 자신이 관리하는 출입문에 들어 올 수 있는 출입자들의 목록을 반환하는 함수
    - 성명, 전화번호, 소속, 직책, 건물명, 출입문명, 방문일시, 방문허가의 정보들을 반환한다.
*/
const getAdminEntrantList = async(adminId) => {
    console.log(adminId);
    const doorIds = await AdminDoor.findAll({
        where:{ adminId },
        attributes:['doorId'],
    });

    const doorIdArray = doorIds.flatMap(data=>data.doorId);

    const userAllow = await UserAllow.findAll({
        where:{ 
            isAllowed:true,
            doorId:doorIdArray,
        },
        attributes:['userId']
    });

    const userIds = Array.from(new Set(userAllow.flatMap(data => data.userId)));

    const SuperUser = await Promise.all(
        userIds.map(async userId => {
            const userInfo = await User.findAll({
                where:{userId},
                include:[{
                    model: UserAllow,
                    where:{isAllowed:true},
                    attributes:['userFlag','doorId']
                }]
            });

            const user = userInfo.flatMap(data=>data.userAllows);
            const doorIds = user.flatMap(data=>data.doorId);


            const doorInfo = await Statement.findAll({
                attributes:['staName'],
                include:[{
                    model:Door,
                    where:{doorId:doorIds},
                    attributes:['doorName']
                }]
            });

            const doorInfos = doorInfo.flatMap(data=>data.dataValues);

            const filterDoorInfos = await Promise.all(
                doorInfos.map(async doors => {
                    console.log(doors.staName);
                    const doorNames = doors.doors.flatMap(data=>data);

                    const doorList = await Promise.all(doorNames.map(async doorName =>{
                        return doorName.doorName
                    }));
                    console.log(doorList);
                    return {
                        staName: doors.staName,
                        doorNameList: doorList,
                    };
            }));

            const result = {
                userFlag: user[0].userFlag,
                userName: userInfo[0].userName,
                company : userInfo[0].company,
                position: userInfo[0].position,
                phoneNum: userInfo[0].phoneNum,
                doorInfo: filterDoorInfos.flatMap(data=>data),
                enterTime: userInfo[0].enterTime,
                exitTime:userInfo[0].exitTime,
                reason: userInfo[0].reason
            };
            return result;
        })
    );
    const allUserData = SuperUser.filter(data => !!data);
    return allUserData;
}

/*
    ▼ 상시 출입자 등록 함수
    - 관리자가 직접 입력하여 상시 출입자의 정보를 기입하여 상시 출입자를 등록하는 함수
    - 상시 출입자가 들어갈 수 있는 출입문들을 허가 해주고 정보를 저장한다.
    - 새로 등록된 상시 출입자의 정보를 반환한다.
*/
const createRegularUserData = async(data) => {
    console.log(data);
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
            reason: '고정 등록자',
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
                    userFlag: data.userFlag,
                });
            })
        );

        return userData;
    }else{
        return null;
    }
}

/*
    ▼ 최고 관리자용 방문자 예약 목록 함수
    - 최고 관리자의 경우 모든 출입문에 대한 출입 예약을 한 방문자 목록을 본다.
    - 출입할 모든 방문자들의 정보를 리턴한다.
*/
const getSuperVisitorList = async() => {
    const SuperUserAllows = await UserAllow.findAll({
        where:{ 
            userFlag:2,
            isAllowed:null,
        }
    });

    const UserAllows = SuperUserAllows.flatMap(data => data);
    const visitorList = await getVisitorList(UserAllows);

    return visitorList;
}

/*
    ▼ 중간 관리자용 방문자 예약 목록 함수
    - 중간 관리자의 경우 자신이 관리하는 출입문에 출입 예약을 한 방문자들만 보여진다.
    - 자신이 관리하는 출입문에 출입할 방문자들의 정보를 리턴한다.
*/
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
                    userFlag:2,
                    isAllowed: null
                }
            });
            return userAllow;
        })
    );

    const UserAllows = await AdminUserAllows.flatMap(data => data);
    const visitorList = await getVisitorList(UserAllows);
    console.log(visitorList);
    return visitorList; 
}

/*
    ▼ 방문자 예약 승인 변경 함수
    - 방문자 예약 승인여부 변경 API에서 사용
    - 관리자가 방문자의 출입을 허가하는 함수
    - 출입을 수락할 경우 Ture를 거절할 경우 False를 allow DB에 저장한다.
    - 결과값을 리턴한다.
*/
const changeVisitorAllow = async(data) => {
    const exAllow = await UserAllow.findOne({
        where: {allowId: data.allowId}
    });
    if(exAllow.isAllowed === null){
        exAllow.isAllowed = data.isAllowed;
        await exAllow.save();
    }
    return exAllow;
}


/*
    ▼ 모든 방문자 리스트 함수
    - app에서 사용자가 입력한 출입 정보들을 받아 해당 정보들을 db에 저장한다.
    - 만일 들어왔던 기록이 존재하는 방문자 일 경우, 출입 허가는 하지 않고, 방문 사유, 출입 시간만 수정하여 등록한다.
    - 처음 등록한 방문자일 경우, 출입 허가는 하지 않고, 모든 정보를 등록한다.
*/
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
                    });
                    
                    let EnterTime = userData.enterTime
                    let ExitTime = userData.exitTime

                    EnterTime.setHours(EnterTime.getHours()+9);
                    ExitTime.setHours(ExitTime.getHours()+9);

                    const setData = {
                        allowId: allowData.allowId,
                        userFlag: allowData.userFlag,
                        userName: userData.userName,
                        company: userData.company,
                        position: userData.position,
                        phoneNum: userData.phoneNum,
                        staName: stateData.staName,
                        doorName: doorData.doorName,
                        enterTime: EnterTime,
                        exitTime: ExitTime,
                        reason: userData.reason,
                        isAllowed: allowData.isAllowed,
                    };
                    console.log(setData);
                    return setData;
                }));

            return setUserData;
        })
    );
    const result = await entrantList.flatMap(data => data);
    return result;
}

/*
    ▼ 방문자 예약 등록 함수
    - app에서 사용자가 입력한 출입 정보들을 받아 해당 정보들을 db에 저장한다.
    - 만일 들어왔던 기록이 존재하는 방문자 일 경우, 출입 허가는 하지 않고, 방문 사유, 출입 시간만 수정하여 등록한다.
    - 처음 등록한 방문자일 경우, 출입 허가는 하지 않고, 모든 정보를 등록한다.
*/
const registUser = async(userInfo) => {

    const exUser = await User.findOne({
        where:{
            phoneNum:userInfo.phoneNum,
        }
    });

    if(exUser){
        console.log('유저 확인');
        exUser.reason = userInfo.reason;
        exUser.enterTime = userInfo.enterTime;
        exUser.exitTime = userInfo.exitTime;
        await exUser.save();
        await UserAllow.create({
            allowId: await uuid.uuid(),
            userFlag:2,
            userId: exUser.userId,
            doorId: userInfo.doorId
        });

        return 200
    }else{
        console.log('유저 없음');
        console.log(userInfo);
        console.log(userInfo.enterTime);
        console.log(typeof(userInfo.enterTime));
        console.log(Date(userInfo.enterTime));
        console.log(typeof(Date(String(userInfo.enterTime))));

        const newUser = await User.create({
            userId: await uuid.uuid(),
            userName: userInfo.name,
            company: userInfo.company,
            position: userInfo.position,
            phoneNum: userInfo.phoneNum,
            userLoginId: userInfo.phoneNum.replace(/-/g,''),
            userLoginPw: userInfo.loginPw,
            reason: userInfo.reason,
            enterTime: Date.parse(userInfo.enterTime),
            exitTime: Date.parse(userInfo.exitTime),
        });
        
        await UserAllow.create({
            allowId: await uuid.uuid(),
            userFlag:2,
            userId: newUser.userId,
            doorId: userInfo.doorId
        });
        return 201
    }
}

/*
    ▼ 아이디를 찾기 위해 사용자가 입력한 정보가 맞는지 체크하는 함수
    - 사용자가 입력한 정보가 존재한다면, 6자리 임시 인증번호를 생성하는 함수를 호출한다.
    - 인증번호를 만든 다음, 해당 유저의 userId를 반환한다.
*/
const findUserId = async(user) => {
    const exUser = await User.findOne({
        where:{
            userName:user.name,
            phoneNum:user.phoneNum,
        }
    });

    if(exUser){
        //인증번호 만들기
        const statusCode = await createToken(exUser.userId,exUser.phoneNum);
        console.log(statusCode);
        if(statusCode == 202){
            return exUser.userId;
        }
        return null;
    }else{
        return null;
    }
}

/*
    ▼ 패스워드를 찾기 위해 사용자가 입력한 정보가 맞는지 체크하는 함수
    - 사용자가 입력한 정보가 존재한다면, 6자리 임시 인증번호를 생성하는 함수를 호출한다.
    - 인증번호를 만든 다음, 해당 유저의 userId를 반환한다.
*/
const findUserPw = async(user) => {
    const exUser = await User.findOne({
        where:{
            userLoginId: user.loginId,
            userName: user.name,
            phoneNum: user.phoneNum,
        }
    });

    if(exUser){
        //인증번호 만들기
        const statusCode = await createToken(exUser.userId,exUser.phoneNum);
        console.log(statusCode);
        if(statusCode == 202){
            return exUser.userId;
        }
        return null;
    }else{
        return null;
    }
    
}

/*
    ▼ 사용자의 6자리 인증번호를 만드는 함수
    - 사용자 계정 찾기에서 사용되는 함수로 본인이 맞는지 체크하기 위한 함수.
    - 랜덤으로 6자리 숫자를 발급하여 사용자가 입력한 전화번호로 인증번호를 문자로 전송한다.
*/
const createToken = async(userId,phoneNum) =>{
    const exToken = await Token.findOne({
        where:{userId:userId}
    });
    var token = Math.floor(100000 + Math.random() * 900000);
    if(exToken){
        exToken.token = token;
        exToken.createdAt = Date.now();
        await exToken.save();
    }else{
        await Token.create({
            token,
            createAt: new Date().now(),
            userId:userId
        });
    }
    var message = `[(주) 명품시스템] 인증번호 [${token}]를 입력해주세요.`
    const result = await sendSMS(phoneNum,message);
    return result;
    //문자발생 함수 token 값 인수
}

/*
    ▼ 사용자의 6자리 인증번호 검증 함수
    - 사용자 계정 찾기에서 사용되는 함수로 찾고자 하는 계정의 소유자와 현재 찾는 사람이 일치하는지 체크하는 함수
    - 사용자가 App에서 입력한 6자리 인증번호를 받아 해당 인증번호가 일치하는지, 시간을 초과되지 않았느지 체크한다.
*/
const checkToken = async(user) =>{
    const exToken = await Token.findOne({
        where:{
            userId:user.userId,
        }
    })
    if(exToken){
        console.log('유저 존재');
        let curr = new Date();
        curr.setHours(curr.getHours()+9);
        curr.setMinutes(curr.getMinutes()-5);
        console.log(curr);
        exToken.createdAt.setHours(exToken.createdAt.getHours()+9);
        console.log(exToken.createdAt);
        console.log(exToken.token);
        console.log(user.token);
        if(exToken.token === user.token && exToken.createdAt >= curr){
            //일치
            console.log('일치');
            return 1
        }else if(exToken.token === user.token && exToken.createdAt < curr){
            // 시간 초과
            console.log('시간 초과');
            return 2
        }else{
            console.log('token값 불일치');
            //token값이 노 일치
            return 3
        }
    }else{
        return 4
    }
}

/*
    ▼ 사용자의 로그인 Id 값을 검색하여 반환하는 함수
    - 유저의 아이디 찾기 API를 위한 함수
    - 사용자의 userId를 통해 로그인Id를 검색하여 유저의 이름과 로그인 Id를 반환한다.
*/
const returnId = async(userId) =>{
    const loginId = await User.findOne({where:{userId:userId.userId}});
    const result = {
        userName : loginId.userName,
        userLoginId: loginId.userLoginId
    }
    return result;
}

/*
    ▼ 사용자의 임시 패스워드(6자리) 값을 생성하여 반환하는 함수
    - 유저 패스워드 찾기 API를 위한 함수
    - 6자리 숫자를 랜덤으로 생성하여 해당 유저 패스워드를 변경 후, 해당 숫자를 반환한다.
*/
const returnPw = async(userId) => {
    const pw = Math.floor(100000 + Math.random() * 900000);
    console.log(String(pw));
    const result = await User.update({userLoginPw:String(pw)},{where:{userId:userId.userId}});
    if(result){
        const userInfo = await User.findOne({where:{userId:userId.userId}});
        return {
            userLoginPw:String(pw),
            userName: userInfo.userName
        };
    }else{
        return null;
    }
}

/*
    ▼ 사용자의 정보를 반환해주는 함수
    - 사용자의 userId를 통해 사용자의 로그인Id, 이름, 전화번호, 회사, 직책 정보를 반환한다.
*/
const getUserInfo = async(userId) => {
    const userInfo = await User.findOne({where:{userId:userId}});
    const result = {
        userLoginId:userInfo.userLoginId,
        userName:userInfo.userName,
        phoneNum:userInfo.phoneNum,
        company:userInfo.company,
        position:userInfo.position,
    }
    return result;
}


/*
    ▼ 사용자가 출입 허가된 출입문을 열어주는 함수
    - 사용자의 userId, App에서 검색한 BeaconId, venerId를 통해 사용자가 접근이 가능한지 체크한 후, 출입문을 열러준다.
    - 사용자의 venderId가 맞는지 체크하고, 출입문의 접근 가능 시간이 맞는지 체크를 한다.
    - 현재 문이 열려있는지 체크를 한 다음, 이상이 없으면 해당 도어들을 열어준다.
    - 열어준 시간을 체크하여 출입 기록을 저장한다.
    - socket 통신을 하여 4초간 문을 열어달라고 출입문에게 요청한다.
    - 오류 혹은 방문 시간이 일치하지 않을 경우 오류 메시지를 반환한다.
*/
const openDoorUser = async(userId, doorIds, vendorId, io) =>{
    const exUser = await User.findOne({where:{userId,vendorId}});
    console.log(doorIds);
    console.log("Start");
    if(!exUser){
        // vendorId 잘못됨
        console.log(`unRegist vendorId : ${vendorId}`);
        return "현재 디바이스에 등록된 \n 계정이 올바르지 않습니다.";
    }else{
        const result = await Promise.all(
            doorIds.map(async doorId =>{
                const exUserAllow = await UserAllow.findOne({where:{userId,doorId}});
                const exDoor = await Door.findOne({where:{doorId}});
                if(exUserAllow){
                    if(exUserAllow.isAllowed){
                        //const exDoor = await Door.findOne({where:{doorId}});
                        var nowTime = new Date();
                        nowTime.setHours(nowTime.getHours()+9);
                        console.log(nowTime);
                        if(exUserAllow.userFlag != 0){
                            let userEnterTime = exUser.enterTime.setHours(exUser.enterTime.getHours()+9);
                            let userExitTime = exUser.exitTime.setHours(exUser.exitTime.getHours()+9);
                            if(exUserAllow.userFlag !== 0 && (userEnterTime  > nowTime || userExitTime < nowTime)){
                                //일일, 자주 방문자들 시간 체크 and 시간 범위에 안맞음
                                console.log(`time range out: ${nowTime}`);
                                return "방문시간이 일치하지 않습니다.";
                            }
                        }
                        console.log(time.getTimeSecond(nowTime));
                        let nowTimeHMS = time.getTimeSecond(nowTime)
                        if(exDoor.openTime <= nowTimeHMS  && exDoor.closeTime >= nowTimeHMS){
                            const exAccessRecord = await AccessRecord.findOne({where:{userId, doorId, exitTime:null}});
                        if(exAccessRecord){
                            exAccessRecord.exitDate = time.getDateHipon(nowTime);
                            exAccessRecord.exitTime = time.getTimeSecond(nowTime),
                            console.log(exAccessRecord.recordId);
                            await exAccessRecord.save();
                        }else{
                            await AccessRecord.create({
                                recordId: await uuid.uuid(),
                                enterDate: time.getDateHipon(nowTime),
                                enterTime: time.getTimeSecond(nowTime),
                                doorId: doorId,
                                userId: userId,
                            });
                        }
                        if(!exDoor.isOpen){
                            io.to(exDoor.socketId).emit('open',{duration:4000});   // 4000ms 4s간 문 열림
                            exDoor.latestDate = time.getDateHipon(nowTime);
                            exDoor.isOpen = true;
                            await exDoor.save();
                        }else{
                            return "현재 문이 열려있습니다.";
                        }
                        //도어 Open socket Io
                        return "인증 성공! 문이 열렸습니다.";
                        }else{
                            return "현재 도어는 접근 시간이 아닙니다."
                        }
                    }else{
                        console.log(`isAllowed : ${exUserAllow.isAllowed}`);
                        return "방문 인증이 되지 않았습니다.";
                        //수락이 안된경우 대기 or 거절
                    }
                }else{
                    if(exDoor){
                        console.log(`unRegist doorId : ${doorId}`);
                        return `해당 ${exDoor.doorName}에 들어갈 권한이 없습니다.`;
                        // doorId 값이 잘못됨
                    }else{
                        return "해당 출입문은 존재하지 않습니다.";
                    }
                }
        }));
        return result;
    }
}

/*
    ▼ 사용자가 임시 패스워드를 받고 패스워드를 변경할 때 사용하는 함수
    - 사용자의 로그인 Id를 조회한 후, 유저가 존재할 시 변경된 패스워드로 바꿔준다.
*/
const changePassword = async(user) =>{
    const exUser = await User.findOne({where:{userLoginId:user.userLoginId}});
    if(exUser){
        console.log(exUser.userName);
        exUser.userLoginPw = user.password;
        await exUser.save();
        return "비밀번호 변경 완료";
    }else{
        return "유저가 존재하지 않습니다.";
    }
}

/*
    ▼ 사용자가 출입할 수 있는 도어들의 정보를 리스트화하는 함수
    - 사용자의 userId를 사용하여 해당 사용자가 들어갈 수 있는 출입문 Id를 검색하여 해당 Id들을 리턴해준다.

*/

const getUserDoorList = async(userId) =>{
    const exUser = await User.findOne({where:{userId:userId}});
    if(exUser){
        const userDoorList = await UserAllow.findAll({where:{userId:userId, isAllowed:true},attributes:["doorId"]});
        const doorList = userDoorList.flatMap(doorIds => doorIds.doorId);
        console.log(doorList);
        return doorList;
    }else{
        return "유저가 존재하지 않습니다.";
    }
}


//외부에서 사용할 수 있게 내보내기
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
    checkToken,
    returnId,
    returnPw,
    getUserInfo,
    openDoorUser,
    changePassword,
    getUserDoorList
}