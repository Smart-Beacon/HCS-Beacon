const express = require('express');

const { getAdminSmsRecord, getSuperSmsRecord, sendSMS } = require('../service/sms');
const checkAdmin = require('../service/check.js');

const router = express.Router();

router.get('/record', async (req,res,next) =>{
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = req.cookies.isSuper;
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check === 0){
            const smsRecord = await getSuperSmsRecord();
            res.json(smsRecord);
        }else if(check === 1){
            const smsRecord = await getAdminSmsRecord(id);
            res.json(smsRecord);
        }
        else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.post('/send', async(req,res,next) => {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = req.cookies.isSuper;
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check !== 2){
            const result = await sendSMS(req.body);
            res.json(result);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});


module.exports = router;