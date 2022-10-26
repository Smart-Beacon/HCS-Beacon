const SocketIO = require('socket.io');
const Door = require('./db/models/door');
const AdminDoor = require('./db/models/adminDoor');
const Admin = require('./db/models/admin');
const AlertRecord = require('./db/models/alertRecord');
const { sendSMS } = require('./service/sms');
const { uuid } = require('./service/createUUID');

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
    const io = SocketIO(server,{
        path:'/socket.io',  
        pingInterval: 25000,
        pingTimeout: 5000,
  });
    //path 수정 필요
    app.set('io',io);

    io.on('connection',(socket) =>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(`새로운 클라이언트 접속 IP Address: ${ip}, Socket Id: ${socket.id}`);

        socket.emit('againSet',"server loading");

        socket.on('disconnect',async()=>{
            console.log(`클라이언트 접속 해제  IP Address: ${ip}, Socket Id: ${socket.id}`);
            await doorWarning(socket.id);
            clearInterval(socket.interval);
        });

        socket.on('error',(error)=>{
            console.error(error);
        });

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