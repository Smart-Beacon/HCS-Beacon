const SocketIO = require('socket.io');
const Door = require('./db/models/door');

module.exports = (server, app) =>{
    const io = SocketIO(server,{path:'/socket.io'});
    app.set('io',io);

    io.on('connection',(socket) =>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속',ip, socket.id, req.ip);
        
        socket.emit('test',"test");


        socket.on('disconnec',()=>{
            console.log('클라이언트 접속 해제',ip,socket.id);
            clearInterval(socket.interval);
        });

        socket.on('error',(error)=>{
            console.error(error);
        });

        socket.on('set',async(data)=>{
            console.log(data);
            const exDoor = await Door.findOne({where:{doorId:data.doorId}});
            if(exDoor){
                exDoor.socketId = socket.id;
                exDoor.isOpen = data.isOpen;
                await exDoor.save();
            }else{
                console.log('error');
            }

            console.log(data.doorId, data.isOpen);
        });

        // socket.on('open',async (data)=>{
        //     const exDoor = await Door.findOne({where:{doorId:data.doorId}});
        //     if(exDoor){
        //         exDoor.isOpen = data.isOpen;
        //         exDoor.socketId = socket.id;
        //         await exDoor.save();
        //     }else{
        //         console.log('error');
        //     }

        //     console.log(data.doorId, data.isOpen);
        // });

    });
};