// express 패키지 사용
const express = require('express');

/*
    ▼ BE/src/service/sms에 위치한 메소드들을 불러온다.
    ▼ BE/src/service/check에 위치한 메소드들을 불러온다.
*/
//const { getAdminSmsRecord, getSuperSmsRecord, sendSMS, } = require('../service/sms');
const { sendSMS } = require('../service/sms');
const checkAdmin = require('../service/check.js');
const router = express.Router();

/*
- 문자 전송 내역의 개발은 안하기로 합의하여 해당 부분은 주석 처리
*/

// router.get('/record', async (req,res,next) =>{
//     try{
//         const id = req.signedCookies.accessToken;
//         const isSuper = Number(req.cookies.isSuper);
//         const check = await checkAdmin.checkAdmin(id,isSuper);
//         if (check === 0){
//             const smsRecord = await getSuperSmsRecord();
//             res.json(smsRecord);
//         }else if(check === 1){
//             const smsRecord = await getAdminSmsRecord(id);
//             res.json(smsRecord);
//         }
//         else{
//             res.status(400).send('Not Found Admin');
//         }
//     }catch(err){
//         res.status(400).send(err.message);
//     }
// });


/* 
    ▼ 사용자에게 어플 링크를 전송하는 API
    - 요청한 클라이언트의 쿠키 값을 확인하여 관리자(최고, 중간)일 경우 문자 전송 함수를 실행한다.
    - 아닐 경우, 관리자가 아니라는 오류 메시지를 반환한다.
    - 클라이언트에게 받은 전화번호에 환경변수에 저장되어 있는 어플 주소 링크를 전송한다.
    - 이후 전송 결과를 리턴한다.
*/ 
router.post('/send', async(req,res,next) => {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check !== 2){
            let app_link = process.env.APP_LINK; //어플 주소
            const result = await sendSMS(req.body.phoneNum, app_link);
            res.status(result).send(result);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
        console.log(err.message);
    }
});


module.exports = router;