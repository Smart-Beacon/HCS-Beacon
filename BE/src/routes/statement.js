const express = require('express');

const router = express.Router();

const checkAdmin = require('../service/check.js');
const { getStatementOfSuper, getStatementOfAdmin, getDoorOfSuper, getDoorOfAdmin } = require('../service/statement');


router.post('/',async(req,res,next) =>{
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        const check = await checkAdmin.checkAdmin(id,isSuper);
        if(check === 0){
            const result = {
                staData: await getStatementOfSuper(),
                doorData: await getDoorOfSuper(),
            }
            res.json(result);
        }else if(check === 1){
            const result = {
                staData: await getStatementOfAdmin(id),
                doorData: await getDoorOfAdmin(id),
            }
            res.json(result);
        }else{
            res.status(400).send('Not Found Admin');
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.post('/regist',async(req,res,next) =>{
    try{
        const result = {
            staData: await getStatementOfSuper(),
            doorData: await getDoorOfSuper(),
        }
        res.status(200).json(result);
    }catch(err){
        res.status(400).send(err.message);
    }
});
module.exports = router;

