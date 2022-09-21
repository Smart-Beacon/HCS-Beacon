const express = require('express');

const checkAdmin = require('../service/check.js');
const getAdminDatas = require('../service/super.js');

const router = express.Router();

router.get('/admins',async(req,res,next) => {
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(id, isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check === 0){
            const adminData = await getAdminDatas.getAdminData();
            res.json(adminData);
        }else{
            res.status(400).send('Not Found SuperAdmin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.post('/admin/register',async(req,res,next) =>{
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(id, isSuper);
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