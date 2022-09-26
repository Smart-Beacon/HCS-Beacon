const express = require('express');

const getMainDatas = require('../service/user');
const checkAdmin = require('../service/check');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 출입자 관리 리스트 API
// GET : http://localhost:5000/user/enterant
router.get('/enterant', async(req,res,next) => {
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
router.post('/enterant', async(req,res,next) =>{
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


// 출입자(방문) 등록API
// POST : http://localhost:5000/user/register
router.post('/register',async(req,res)=>{
    try{
        const result = await getMainDatas.registUser(req.body);
        res.status(result).end();
    }catch(err){
        return res.status(400).send(err.message);
    }

});

// 모든 출입자 ID 찾기
// POST : http://localhost:5000/user/check/id
router.post('/check/id',async(req,res)=>{
    try{
        const result = await getMainDatas.findUserId(req.body);
        if(result){
            res.status(200).send(result);
        }else{
            res.status(404).end();
        }
    }catch(err){
        return res.status(400).send(err.message);
    }
});

// 모든 출입자 PW 찾기
// POST : http://localhost:5000/user/check/pw
router.post('/check/pw',async(req,res)=>{
    try{
        const result = await getMainDatas.findUserPw(req.body);
        if(result){
            res.status(200).send(result);
        }else{
            res.status(400).end();
        }
    }catch(err){
        return res.status(400).send(err.message);
    }  
});

// 출입자 Id 반환
// POST : http://localhost:5000/user/find/id
router.post('/find/id',async(req,res)=>{
    try{
        const result = await getMainDatas.checkToken(req.body);
        if(result === 1){
            const userInfo = await getMainDatas.returnId(req.body);
            return res.status(200).send(userInfo);
        }else if(result === 2){
            return res.status(204).end();
        }else if(result === 3){
            return res.status(205).end();
        }else{
            return res.status(400).end();
        }
    }catch(err){
        return res.status(400).send(err.message);
    }
});

// 출입자 임시pw 반환
// POST : http://localhost:5000/user/find/pw
router.post('/find/pw',async(req,res)=>{
    try{
        const result = await getMainDatas.checkToken(req.body);
        if(result === 1){
            const userLoginPw = await getMainDatas.returnPw(req.body);
            return res.status(200).json(userLoginPw);
        }else if(result === 2){
            return res.status(400).end();
        }else if(result === 3){
            return res.status(401).end();
        }else{
            return res.status(402).end();
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.post('/info',async(req,res)=>{
    //token사용할건지??
    //사용자 인지 확인되면 그대로 값 반환
    try{
        const token = req.headers.token;
        console.log(token);
        if(!token){
            return res.json(util.fail(CODE.BAD_REQUEST, MSG.EMPTY_TOKEN));
        }
        const user = await jwt.verify(token,process.env.JWT_SECRET);
        console.log(user.userId);
        const result = await getMainDatas.getUserInfo(user.userId);
        return res.status(200).json(result);
    }catch(err){
        console.log(err.message);
        res.status(400).send(err.message);
    }
});

router.post('/opendoor',async(req,res)=>{
    try{
        const token = req.headers.token;
        const {doorId, deviceId} = req.body;
        console.log(token);
        if(!token){
            return res.json(util.fail(CODE.BAD_REQUEST, MSG.EMPTY_TOKEN));
        }
        const user = await jwt.verify(token,process.env.JWT_SECRET);
        console.log(user.userId);
        const result = await getMainDatas.openDoorUser(user.userId,doorId,deviceId);
        return res.status(result).end();
    }catch(err){
        console.log(err.message);
        res.status(400).send(err.message);
    }
});

module.exports = router;