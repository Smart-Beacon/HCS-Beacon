const SocketIO = require('socket.io');
const Door = require('./db/models/door');

module.exports = (server, app) =>{
    const io = SocketIO(server,{path:'/socket.io'});
    //path 수정 필요
    app.set('io',io);

    io.on('connection',(socket) =>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(`새로운 클라이언트 접속 IP Address: ${ip}, Socket Id: ${socket.id}`);

        socket.on('disconnect',()=>{
            console.log(`클라이언트 접속 해제  IP Address: ${ip}, Socket Id: ${socket.id}`);
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
                await exDoor.save();
            }else{
                console.log('error');
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

        // socket.on('open',async (data)=>{
        //     const exDoor = await Door.findOne({where:{doorId:data.beaconId}});
        //     if(exDoor){
        //         exDoor.isOpen = data.isOpen;
        //         //exDoor.isOpen = true;
        //         exDoor.socketId = socket.id;
        //         await exDoor.save();
        //     }else{
        //         console.log('error');
        //     }
        //     console.log(data.beaconId, data.isOpen);
        // });

        // socket.on('close',async (data)=>{
        //     const exDoor = await Door.findOne({where:{doorId:data.beaconId}});
        //     if(exDoor){
        //         exDoor.isOpen = data.isOpen;
        //         //exDoor.isOpen = false;
        //         exDoor.socketId = socket.id;
        //         await exDoor.save();
        //     }else{
        //         console.log('error');
        //     }
        //     console.log(data.beaconId, data.isOpen);
        // });
    });
};