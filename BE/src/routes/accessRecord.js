const express = require('express');

const getMainDatas = require('../service/accessRecord');
const checkAdmin = require('../service/check');

const router = express.Router();

// 출입문 입출이력(리스트업)
// GET : http://localhost:5000/accessRecord
router.get('/', async(req,res,next)=> {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(`adminId: ${id}, isSuper: ${isSuper}`);
        const check = await checkAdmin.checkAdmin(id, isSuper);
        if(check === 0){
            const data = await getMainDatas.getSuperAccessRecord();
            res.json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminAccessRecord(id);
            res.json(data);
        }else{
            res.status(403).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports = router;