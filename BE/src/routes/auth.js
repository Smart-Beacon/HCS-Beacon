const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../db/models/admin');
const SuperAdmin = require('../db/models/superAdmin');

const router = express.Router();

router.post('/login', async(req,res,next) =>{
    const { ID, PW } = req.body;
    try{
        const exSuperAdmin = await SuperAdmin.findOne({
            where: {superLoginId:ID}
        });
        if (exSuperAdmin){
            const checkPassword = await bcrypt.compare(PW,exSuperAdmin.superLoginPw);
            if(checkPassword){
                const cookiedata = {
                    id: exSuperAdmin.superId,
                    isSuper: 1
                };
                res.cookie('accessToken',cookiedata,{
                    expires: new Date(Date.now() + 1000*60*60*24*7),
                    httpOnly: true,
                    secure:false,
                    signed:true,
                });
                console.log(res.getHeader('set-cookie'),1);
                return res.status(200).end();
            }else{
                return res.status(202).send('비밀번호가 일치하지 않습니다.');
            } 
        }else{
            const exAdmin = await Admin.findOne({
                where: {adminLoginId:ID}
            });
            if(exAdmin){
                const checkPassword = await bcrypt.compare(PW,exAdmin.adminLoginPw);
                if(checkPassword){
                    const cookiedata = {
                        id: exAdmin.adminId,
                        isSuper: 0
                    };
                    res.cookie('accessToken',cookiedata,{
                        expires: new Date(Date.now() + 1000*60*60*24*7),
                        httpOnly: true,
                        secure:false,
                        signed:true,
                    });
                    console.log(res.getHeader('set-cookie'),0);
                    return res.status(200).end();
                }else{
                    return res.status(202).send('비밀번호가 일치하지 않습니다.');
                } 
            }
            else{
                return res.status(202).send('존재하지 않는 아이디입니다.');
            }
        }
    }catch(err){
        console.error(err);
        return res.status(500).send(err.message);
    }
});

router.post('/logout', (req,res)=>{
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