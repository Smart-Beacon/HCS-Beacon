const express = require('express');

const getMainDatas = require('../service/user');
const checkAdmin = require('../service/check');

const router = express.Router();

// 
router.get('/entrant', async(req,res,next) => {
    const { id, isSuper } = req.signedCookies.accessToken;
    console.log(`adminId: ${id}, isSuper: ${isSuper}`);
    try{
        const check = await checkAdmin.checkAdmin(id, isSuper);
        if (check === 0){
            const data = await getMainDatas.getSuperEntrantList();
            res.json(data);
        }else if(check === 1){
            const data = await getMainDatas.getAdminEntrantList(id);
            res.json(data);
        }else{
            res.status(400).send(err.message);
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.post('/entrant', async(req,res,next) =>{
    const { id, isSuper } = req.signedCookies.accessToken;
    console.log(`adminId: ${id}, isSuper: ${isSuper}`);
    try{
        const check = await checkAdmin.checkAdmin(id, isSuper);
        if(check !== 2){
            const userData = await getMainDatas.createUserData(req,body);
            if(userData){
                console.log(userData);
                res.status(201).json(userData);
            }else{
                console.log('존재하는 사용자 ID입니다.');
                res.status(406).json('존재하는 사용자 ID입니다.');
            }
        }else{
            res.status(403).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports = router;