const express = require('express');

const checkAdmin = require('../service/check.js');
const getAdminDatas = require('../service/super.js');


const router = express.Router();


router.get('/id/admins',async(req,res,next) => {
    const { id, isSuper } = req.signedCookies.accessToken;
    console.log(id, isSuper);
    try{
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if (check === 0){
            const adminData = await getAdminDatas.getAdminData();
            console.log(adminData);
            res.json(adminData);
        }else{
            res.status(400).send('Not Found SuperAdmin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.post('/id/admins',async(req,res,next) =>{

})

module.exports = router;
