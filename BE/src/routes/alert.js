// ▼ express 패키지 사용
const express = require('express');

// ▼ BE/src/service에 위치한 세부 메서드를 로드
const getWarning = require('../service/alert.js');
const checkAdmin = require('../service/check.js');

// ▼ express Router 사용
const router = express.Router();

/*
    ▼ 경보 이력 페이지 데이터 요청을 처리하는 API 
    - 경보 이력 페이지 데이터 요청
    - 건물명, 출입문명, 비콘ID, 경보날짜, 경보시간, 담당관리자를 Json 데이터로 전송
*/
router.get('/', async (req,res,next) =>{
    try{    
        // 쿠키 값으로 사용자가 접속한 계정에 따라 어떤 관리자인지 확인한다.
        // 이 때 check에 담기는 값 -> (최고 관리자: 0 / 중간 관리자: 1 / 관리자 아님: 2)
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(id, isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        // 최고 관리자라면 모든 출입문에서 발생한 경고 이력 정보를 준다.
        if (check === 0){
            const alertData = await getWarning.getAlertSuperDatas();
            res.status(200).json(alertData);
        }
        // 중간 관리자라면 자신이 관리하는 출입문에서 발생한 경고 이력 정보만 준다.
        else if(check === 1){
            const alertData = await getWarning.getAlertDatas(id);
            res.status(200).json(alertData);
        }
        // 관리자가 아니라면 http status 400을 반환한다.
        else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(500).send(err.message);
    }
});


module.exports = router;