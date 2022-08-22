const express = require('express');

const getMainDatas = require('../../service/main.js');

const router = express.Router();

// 실시간 감시 현황 페이지 데이터 요청
// 건물명, 출입문 명, 비콘ID, 현재상태, 개방시간, 폐쇄시간, 경보상태를 Json 데이터로 전송
router.get('/', async(req,res,next) =>{
    const { token } = req.signedCookies.accessToken
    if (token && token.adminId !== ''){
        try{
            const data = await getMainDatas.getDoorDatas(token.adminId);

            res.json(data);
        }catch(err){
            res.status(400).send(err.message);
        }
    }else{
        res.status(400).send('Not Found Cookie');
    }
});

// 출입문 관리 설정 페이지 데이터 요청
// 건물명, 출입문 명, 비콘ID, 현재상태, 출입관리, 개방시간, 폐쇄시간를 Json 데이터로 전송
router.get('/', async(req,res,next) => {
    const { token } = req.signedCookies.accessToken
    if (token && token.adminId !== ''){
        try{
            const data = await getMainDatas.getDoorDatas(token.adminId);

            res.json(data);
        }catch(err){
            res.status(400).send(err.message);
        }
    }else{
        res.status(400).send('Not Found Cookie');
    }
});

module.exports = router;