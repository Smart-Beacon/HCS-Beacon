const express = require('express');

const getMainDatas = require('../service/door.js');
const checkAdmin = require('../service/check.js');

const router = express.Router();

// 실시간 감시 현황 페이지 데이터 요청
// 건물명, 출입문 명, 비콘ID, 현재상태, 개방시간, 폐쇄시간, 경보상태를 Json 데이터로 전송
router.get('/monitor', async(req,res,next) =>{
    try{
        const { id, isSuper } = req.signedCookies.accessToken;
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check !== 2){
            const Name = await getMainDatas.getAdminName(id,isSuper);
            const doorData = await getMainDatas.getAllDoorData();
            const result = {
                name: Name,
                doorData: doorData,
            }
            console.log(result);
            res.json(result);
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
        const { id, isSuper } = req.signedCookies.accessToken
        console.log(id, isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if(check === 0){
            const data = await getMainDatas.getSuperDoorDatas();
            res.json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminDoorDatas(id);
            res.json(data);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

// 질문
// 출입문 관리 설정 (등록 모달)
// 담당관리자만 해당
router.post('/register',async(req,res,next)=>{
    try{
        const { id, isSuper } = req.signedCookies.accessToken
        console.log(id, isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if(check === 0){
            const data = await getMainDatas.getSuperDoorDatas();
            res.json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminDoorDatas(id);
            res.json(data);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }

});

module.exports = router;