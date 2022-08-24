const express = require('express');

const getMainDatas = require('../service/user');
const checkAdmin = require('../service/check');

const router = express.Router();

// 
router.get('/user', async(req,res,next) => {
    const {id, isSuper} = req.signedCookies.accessToken;
    console.log(id, isSuper);
    try{
        const check = await checkAdmin.checkAdmin(id, isSuper);
        if (check === 0){
            const data = await getMainDatas.getSuperUserAllows();
            res.json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminUserAllows(id);
            res.json(data);
        }else{
            res.status(400).send(err.message);
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports = router;