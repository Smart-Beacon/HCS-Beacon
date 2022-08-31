const express = require('express');

const checkAdmin = require('../service/check.js');
const getAdminDatas = require('../service/super.js');
const getMainDatas = require('../service/door.js');

const router = express.Router();

router.get('/admins',async(req,res,next) => {
    const { id, isSuper } = req.signedCookies.accessToken;
    console.log(id, isSuper);
    try{
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check === 0){
            const doorData = await getMainDatas.getAllDoorData();
            const adminData = await getAdminDatas.getAdminData();
            const result = {
                doorData,
                adminData,
            };
            res.json(result);
        }else{
            res.status(400).send('Not Found SuperAdmin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.post('/admin/register',async(req,res,next) =>{
    const { id, isSuper } = req.signedCookies.accessToken;
    console.log(id, isSuper);
    try{
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check === 0){
            const adminData = await getAdminDatas.createAdminData(req.body);
            if (adminData){
                console.log(adminData);
                res.status(201).json(adminData);
            }else{
                console.log('존재하는 ID입니다.');
                res.status(406).json('존재하는 ID입니다.');
            }
        }else{
            res.status(403).send('Not Found SuperAdmin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }

})

module.exports = router;
