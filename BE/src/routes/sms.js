const express = require('express');

//const getWarning = require('../service/alert.js');
const { getAdminSmsRecord, getSuperSmsRecord } = require('../service/sms');
const checkAdmin = require('../service/check.js');

const router = express.Router();

router.get('/', async (req,res,next) =>{
    const { id, isSuper } = req.signedCookies.accessToken;
    console.log(id, isSuper);
    try{
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


module.exports = router;