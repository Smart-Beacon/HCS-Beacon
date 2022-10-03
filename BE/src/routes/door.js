const express = require('express');

const getMainDatas = require('../service/door.js');
const checkAdmin = require('../service/check.js');

const router = express.Router();

// 실시간 감시 현황 페이지 데이터 요청
// 건물명, 출입문 명, 비콘ID, 현재상태, 개방시간, 폐쇄시간, 경보상태를 Json 데이터로 전송
router.get('/monitor', async(req,res,next) =>{
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(id, isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check !== 2){
            console.log('enter');
            const doorData = await getMainDatas.getAllDoorData();
            console.log(doorData);
            res.json(doorData);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

// 출입문 관리 설정 페이지 데이터 요청
// 건물명, 출입문 명, 비콘ID, 현재상태, 출입관리, 개방시간, 폐쇄시간를 Json 데이터로 전송
router.get('/management', async(req,res,next) => {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(id, isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if(check === 0){
            const data = await getMainDatas.getSuperDoorDatas();
            res.status(200).json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminDoorDatas(id);
            res.status(200).json(data);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

// 출입문 관리 설정 (등록 모달)
// 출입문 데이터 새 등록
router.post('/register',async(req,res,next)=>{
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if(check !== 2){
            const result = await getMainDatas.createDoorData(req.body);
            if(result){
                res.status(201).end();
            }else{
                res.status(400).send('Unregistered Admin or registered Door');    
            }
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

//비상도어 리스트(중간 관리자) API
router.get('/adminemergency', async(req,res,next) => {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(id, isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if(check === 0){
            const data = await getMainDatas.getSuperEmergency();
            res.json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminEmergency(id);
            res.json(data);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

//비상도어 개방 API
router.post('/adminemergency', async(req,res,next) => {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(id, isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if(check !== 2){
            const data = await getMainDatas.emergencyOpen(req.body);
            if(data){
                res.status(200).end();
                // console.log(data);
                // res.status(200).json(data);
            }
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});



module.exports = router;