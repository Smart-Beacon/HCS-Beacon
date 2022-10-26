const express = require('express');

const { getAdminSmsRecord, getSuperSmsRecord, sendSMS, } = require('../service/sms');
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


// 핸드폰 번호 및 전송할 메시지 내역(어플 주소)를 통해 사용자에게 어플 링크를 전송하는 API

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