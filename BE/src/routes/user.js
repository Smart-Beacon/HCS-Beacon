const express = require('express');

const getMainDatas = require('../service/user');
const checkAdmin = require('../service/check');

const router = express.Router();

// 출입자 관리 리스트 API
// GET : http://localhost:5000/user/enterant
router.get('/entrant', async(req,res,next) => {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(`adminId: ${id}, isSuper: ${isSuper}`);
        const check = await checkAdmin.checkAdmin(id, isSuper);
        if (check === 0){
            const data = await getMainDatas.getSuperEntrantList();
            res.json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminEntrantList(id);
            res.json(data);
        }else{
            res.status(400).send(err.message);
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

// 출입자(상시) 등록 API
// POST : http://localhost:5000/user/enterant
router.post('/entrant', async(req,res,next) =>{
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(`adminId: ${id}, isSuper: ${isSuper}`);
        const check = await checkAdmin.checkAdmin(id, isSuper);
        if(check !== 2){
            const userData = await getMainDatas.createRegularUserData(req.body);
            if(userData){
                res.status(201).end();
                // console.log(userData);
                // res.status(201).json(userData);
            }else{
                console.log('존재하는 사용자 ID입니다.');
                res.status(406).json('존재하는 사용자 ID입니다.');
            }
        }else{
            res.status(403).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

// 방문자 예약승인 리스트 API
// GET : http://localhost:5000/user/visitor
router.get('/visitor', async (req,res,next) => {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(`adminId: ${id}, isSuper: ${isSuper}`);
        const check = await checkAdmin.checkAdmin(id, isSuper);
        if(check === 0){
            const data = await getMainDatas.getSuperVisitorList();
            res.json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminVisitorList(id);
            res.json(data);
        }else{
            res.status(403).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

// 방문자 예약 승인여부 변경 API
// POST : http://localhost:5000/user/visitor
router.post('/visitor', async (req,res,next) => {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(`adminId: ${id}, isSuper: ${isSuper}`);
        const check = await checkAdmin.checkAdmin(id, isSuper);
        if(check !== 2){
            const data = await getMainDatas.changeVisitorAllow(req.body);
            if(data){
                res.status(200).end();
                // console.log(data);
                // res.status(201).json(data);
            }
        }else{
            res.status(403).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports = router;