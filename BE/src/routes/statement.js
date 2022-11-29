// ▼ express 패키지 사용
const express = require('express');
const router = express.Router();

/*
    ▼ BE/src/service/check에 위치한 메소드들을 불러온다.
    ▼ BE/src/service/statement에 위치한 메소드들을 불러온다.
*/
const checkAdmin = require('../service/check.js');
const { getStatementOfSuper, getStatementOfAdmin, getDoorOfSuper, getDoorOfAdmin } = require('../service/statement');

/*
    ▼ 관리자 혹은 사용자에게 보여줄 건물 정보 및 출입문 정보 데이터를 반환하는 API 
    - 웹 페에지에서 관리자가 새로 등록될 때 혹은 사용자가 등록될 때, 어떤 건물 및 출입문이 있는지 보여주기 위함이다.
    - 건물 정보는 건물명, 건물Id를 출입문 정보는 출입문 이름, 출입문 Id, 건물 Id를 보낸다.
    - 최고 관리자의 경우 모든 건물 및 출입문 정보를 보여준다.
    - 중간 관리자의 경우 자신이 관리하는 건물 및 출입문 정보만 보여준다.
*/
router.post('/',async(req,res,next) =>{
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if(check === 0){
            const result = {
                staData: await getStatementOfSuper(),
                doorData: await getDoorOfSuper(),
            }
            res.json(result);
        }else if(check === 1){
            const result = {
                staData: await getStatementOfAdmin(id),
                doorData: await getDoorOfAdmin(id),
            }
            res.json(result);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

/*
    ▼ 사용자에게 보여줄 건물 정보 및 출입문 정보 데이터를 반환하는 API 
    - App에서 방문 신청을 하기 위해 보여줘야 하는 모든 건물 이름 및 출입문 이름을 보내준다.
    - 건물 정보는 건물명, 건물Id를 출입문 정보는 출입문 이름, 출입문 Id, 건물 Id를 보낸다.
*/
router.post('/regist',async(req,res,next) =>{
    try{
        const result = {
            staData: await getStatementOfSuper(),
            doorData: await getDoorOfSuper(),
        }
        res.status(200).json(result);
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports = router;

