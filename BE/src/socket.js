//  ▼ SocketIO 패키지 사용(소켓 통신)
const SocketIO = require('socket.io');

//  ▼ BE/src/db/models 에 위치한 모델 파일을 각각 클래스 형태로 불러온다.
const Door = require('./db/models/door');
const AdminDoor = require('./db/models/adminDoor');
const Admin = require('./db/models/admin');
const AlertRecord = require('./db/models/alertRecord');

//  ▼ BE/src/service/sms에 위치한 메소드들을 불러온다.
//  ▼ BE/src/service/createUUID에 위치한 메소드들을 불러온다.
const { sendSMS } = require('./service/sms');
const { uuid } = require('./service/createUUID');

/*
    ▼ 출입문에 이상이 발생하였을 시 실행되는 함수
    - 출입문과 통신이 끊기거나, 다른 이상이 발생할 시 실행
    - 이상이 생긴 출입문의 SocketId를 매개변수로 받온다.
    - 해당 소켓과 매칭되는 출입문을 관리하는 관리자들에게 이상이 발생했음을 문자로 전송한다.
    - 경보 이력 정보에 해당 출입문을 추가 한다.
*/
const doorWarning = async(socketId) =>{
    if(socketId){
        const exDoor = await Door.findAll({
            where:{socketId},
            include:[{
                model:AdminDoor,
                attributes:['adminId']
            }]
        });
        if(exDoor){
            const adminDoorList = exDoor.flatMap(data => data.adminDoors);
            const filterAdminList = adminDoorList.flatMap(data=>data.dataValues);
            await Promise.all(   
                filterAdminList.map(async admin =>{
                    const exAdmin = await Admin.findOne({where:{adminId:admin.adminId}});
                    if(exAdmin){
                        let msg = `${exDoor[0].doorName}의 문이 이상이 생겼습니다.`;
                        const smsResult = await sendSMS(exAdmin.phoneNum,msg);
                        console.log(smsResult);
                        console.log(msg);
                    }   
                    else{
                        console.log(`${admin.adminId}는 존재하지 않습니다.`);
                    }
                })
            );
            let nowTime = new Date();
            //nowTime.setHours(nowTime.getHours()+9);
            console.log(exDoor[0].doorId);
            console.log(nowTime);
            await AlertRecord.create({
                recordId: await uuid(),
                startTime: nowTime,
                doorId: exDoor[0].doorId
            });
            await Door.update({warning:true},{where:{socketId}});
        }else{
            console.log("존재하지 않는 socket Id입니다.")
        }
    }else{
        console.log("socketId is null");
    }
    // null 일경우 체크
}

module.exports = (server, app) =>{
    // Socket 통신의 초기 설정
    // 소켓 통신의 기본 path를 설정
    const io = SocketIO(server,{
        path:'/socket.io',  
        pingInterval: 25000,
        pingTimeout: 5000,
    });
    //path 수정 필요
    app.set('io',io);

    /*
        ▼ 소켓 연결이 되었을 때 실행
        - 새로 접속된 IP와 새로 부여 받은 SocketId를 콘솔로 찍어 보여준다.
    */
    io.on('connection',(socket) =>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(`새로운 클라이언트 접속 IP Address: ${ip}, Socket Id: ${socket.id}`);

        socket.emit('againSet',"server loading");

        /*
            ▼ 소켓 통신이 끊겼을 시 실행
            - 통신이 끊긴 SocketId를 doorWraning함수에 전달하여 해당 메소드 실행
        */
        socket.on('disconnect',async()=>{
            console.log(`클라이언트 접속 해제  IP Address: ${ip}, Socket Id: ${socket.id}`);
            await doorWarning(socket.id);
            clearInterval(socket.interval);
        });


        /*
            ▼ 소켓 통신 오류 발생 시 실행
            - 오류 메시지를 콘솔에 찍는다.
        */
        socket.on('error',(error)=>{
            console.error(error);
        });

        /*
            ▼ 소켓 통신에서 'set'을 수신할 때 실행
            - 클라이언트로부터 받은 BeaconId를 통해 출입문을 조회한 후, 해당 출입문이 존재할 시
            socketId 값과 이상 없다는 정보를 저장한다.
        */
        socket.on('set',async(data)=>{
            console.log(data);
            const exDoor = await Door.findOne({where:{doorId:data.beaconId}});
            if(exDoor){
                exDoor.socketId = socket.id;
                exDoor.warning = false;
                await exDoor.save();
            }else{
                console.log('존재하지 않는 BeaconId입니다.');
            }

            console.log(data.beaconId, socket.id);
        });

        
        /*
            ▼ 소켓 통신에서 'change'를 수신할 때 실행
            - 라즈베리파이로부터 받은 BeaconId를 통해 출입문을 조회한 후, 해당 출입문이 존재할 시
            socketId 값과 문의 개방 여부의 정보를 저장한다.
        */
        socket.on('change',async(data)=>{
            const exDoor = await Door.findOne({where:{doorId:data.beaconId}});
            if(exDoor){
                exDoor.isOpen = data.isOpen;
                exDoor.socketId = socket.id;
                await exDoor.save();
            }else{
                console.log('error');
            }
            console.log(data.beaconId, data.isOpen);
        });
    });
};