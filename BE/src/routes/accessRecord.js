const express = require('express');

const getMainDatas = require('../service/accessRecord');
const checkAdmin = require('../service/check');

const router = express.Router();


router.get('/', async(req,res,next)=> {
    const { id, isSuper } = req.signedCookies.accessToken;
    console.log(`adminId: ${id}, isSuper: ${isSuper}`);
    try{
        const check = await checkAdmin.checkAdmin(id, isSuper);
        if(check === 0){
            const data = await getMainDatas.getSuperAccessRecord();
            res.json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminAccessRecord(id);
            res.json(data);
        }else{
            res.status(400).send(err.message);
        }
    }catch{
        res.status(400).send(err.message);
    }
});

module.exports = router;