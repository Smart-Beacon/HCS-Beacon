const express = require('express');

const getWarning = require('../service/warning.js');
const checkAdmin = require('../service/check.js');

const router = express.Router();

router.get('/', async (req,res,next) =>{
    const { id, isSuper } = req.signedCookies.accessToken;
    console.log(id, isSuper);
    try{
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check !== 2){
            const warningData = await getWarning.getAlertDatas(id);
            res.json(warningData);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});


module.exports = router;