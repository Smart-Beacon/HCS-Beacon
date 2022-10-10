const SocketIO = require('socket.io');
const Door = require('./db/models/door');

module.exports = (server, app) =>{
    const io = SocketIO(server,{path:'/socket.io'});
    app.set('io',io);
    const openDoor = io.of('/open');
    const reservationDoor = io.of('/reservation');
    const emergencyDoor = io.of('/emergency');

    openDoor.on('connection',(socket)=>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log('클라이언트 연결 : ', ip, socket.id);
        console.log('openDoor 네임스페이스에 접속');
        
        // 문이 닫힐 때 실행되는 함수
        socket.on('close',async (data)=>{   
            const exDoor = await Door.findOne({where:data.doorId});
            if(exDoor){
                console.log(`${data.doorId} Door is ${data.isOpen}`);
                exDoor.isOpen = data.isOpen;
                await exDoor.save();
            }
        });

        //연결을 끊을 때,
        socket.on('disconnect', () =>{
            console.log('openDoor 네임스페이스 접속 해제',ip,socket.id);
        });

        //연결 에러 발생 할 때,
        socket.on('error', (error) => {
            console.error(error);
        });
    });

    reservationDoor.on('connection',(socket)=>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log('클라이언트 연결 : ', ip, socket.id);
        console.log('openDoor 네임스페이스에 접속');

        socket.on('close',async (data)=>{
            const exDoor = await Door.findOne({where:data.doorId});
            if(exDoor){
                console.log(`${data.doorId} Door is ${data.isOpen}`);
                exDoor.isOpen = data.isOpen;
                await exDoor.save();
            }
        });

        socket.on('disconnect', () =>{
            console.log('openDoor 네임스페이스 접속 해제',ip,socket.id);
        });

        socket.on('error', (error) => {
            console.error(error);
        });
    });

    emergencyDoor.on('connection',(socket)=>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log('클라이언트 연결 : ', ip, socket.id);
        console.log('openDoor 네임스페이스에 접속');
        
        socket.on('close',async (data)=>{
            const exDoor = await Door.findOne({where:data.doorId});
            if(exDoor){
                console.log(`${data.doorId} Door is ${data.isOpen}`);
                exDoor.isOpen = data.isOpen;
                await exDoor.save();
            }
        });

        socket.on('disconnect', () =>{
            console.log('openDoor 네임스페이스 접속 해제',ip,socket.id);
        });

        socket.on('error', (error) => {
            console.error(error);
        });
    });

    const openData = {
        doorId: "ss",    // doorId를 같이 보내 나중에 응답 받을 때 활용(특정 클라이언트 ID를 가지고 올 수 만 있다면 그걸로 구별)
        isOpen:true,    // 오픈 True
        time: 4000,     //그냥 오픈 4s(4000ms) + 예약 오픈 xs(x*1000ms) + 비상 도어 개방 x1s(x1*1000ms)
    };
    openDoor.to(id).emit('openDoor',openData);
    emergencyDoor.to(id).emit('emergencyDoor', openData);
    reservationDoor.to(id).emit('reservationDoor',openData);

    io.on('connection',(socket) =>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속',ip,socket.id,req.ip);
        socket.on('disconnec',()=>{
            console.log('클라이언트 접속 해제',ip,socket.id);
            clearInterval(socket.interval);
        });

        socket.on('error',(error)=>{
            console.error(error);
        });

        socket.on('reply',(data)=>{
            console.log(data);
        });

        socket.interval = setIntervar(()=>{
            socket.emit('news','Hello Socket.IO');
        },3000);
    });
};