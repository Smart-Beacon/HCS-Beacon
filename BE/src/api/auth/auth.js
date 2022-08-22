const express = require('express');
const bcrypt = require('bcrypt');

const Admin = require('../../db/models/admin');

const router = express.Router();

router.post('/login', async(req,res,next) =>{
    const { id, password } = req.body;

    try{
        const exAdmin = await Admin.findOne({
            where:{ adminLoginId:id },
        });
    
        if(exAdmin){
            const checkPassword = await bcrypt.compare(password,exAdmin.adminLoginPw);
            if(checkPassword){
                res.cookie('accessToken',exAdmin.adminId,{
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true,
                    secure:false,
                    signed:true,
                })
                return res.status(200).end();
            }else{
                return res.status(202).send('비밀번호가 일치하지 않습니다.');
            }
        }   
        else{
            return res.status(202).send('존재하지 않는 아이디입니다.');
        }
    }catch(err){
        console.error(err);
        return res.status(500).send(err.message);
    }
});

router.get('/logout', (req,res)=>{
    try{
        console.log('로그아웃');
        res.clearCookie('accessToken');
        res.end();
    }catch(err){
        console.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;