const express = require('express');

const getWarning = require('../service/alert.js');
const checkAdmin = require('../service/check.js');

const router = express.Router();

router.get('/', async (req,res,next) =>{
    try{    
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(id, isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check === 0){
            const alertData = await getWarning.getAlertSuperDatas();
            res.status(200).json(alertData);
        }else if(check === 1){
            const alertData = await getWarning.getAlertDatas(id);
            res.status(200).json(alertData);
        }
        else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(500).send(err.message);
    }
});


module.exports = router;