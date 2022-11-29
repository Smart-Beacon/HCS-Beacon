/* 
    ▼ express 패키지 사용
    ▼ 관리자의 비밀번호를 암호화하기 위해 bcrypt 패키지를 사용
    ▼ 쿠키를 암호화하기 위해 CryptoJS 패키지를 사용
    ▼ 사용자 로그인 시 JWT를 사용하기 위해 jsonwebtoken 패키지를 사용
*/
const express = require('express');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// ▼ BE/src/db/models 에 위치한 모델 파일을 각각 클래스 형태로 불러온다.
const Admin = require('../db/models/admin');
const SuperAdmin = require('../db/models/superAdmin');
const User = require('../db/models/user');

const router = express.Router();

/*
    ▼ 관리자 로그인을 처리하는 API
    - 클라이언트로부터 받은 ID와 PW를 통해 관리자를 찾는다.
    - 최고 관리자 ID인지 먼저 확인한 후, 최고 관리자의 ID일 경우 패스워드를 비교한다.
    - 패스워드 비교는 패스워드를 암호화하여 암호화된 패스워드를 비교한다.
    - 패스워드가 올바른 경우, 관리자의 adminId를 쿠키에 담는다.
    - 쿠키를 통해 최고 관리자인지 중간관리자인지 알기 위해 쿠키에 isSuper 변수를 담는다.(isSuper 1: 최고 관리자, 0:중간관리자)
    - 관리자의 이름을 CryptoJS을 통해 암호화하여 데이터로 보낸다.
    - JavaScript에서 제공해주는 암호화 쿠키를 사용하여 쿠키를 암호화한다.(함부로 쓰지 못하게 하기 위함)
*/
router.post('/login', async(req,res,next) =>{
    const { ID, PW } = req.body;
    try{
        const exSuperAdmin = await SuperAdmin.findOne({
            where: {superLoginId:ID}
        });
        if (exSuperAdmin){
            const checkPassword = await bcrypt.compare(PW,exSuperAdmin.superLoginPw);
            if(checkPassword){
                res.cookie('accessToken',exSuperAdmin.superId,{
                    expires: new Date(Date.now() + 1000*60*60*24*3),
                    httpOnly: false, // 나중에 secure 및 httpOnly는 true로 바꿔줘야함
                    secure:false,
                    signed:true,
                });
                res.cookie('isSuper',1,{
                    expires: new Date(Date.now() + 1000*60*60*24*3),
                    httpOnly: false, // 나중에 secure 및 httpOnly는 true로 바꿔줘야함
                    secure:false,
                });
                const str = exSuperAdmin.superName;
                const encrypted = CryptoJS.AES.encrypt(JSON.stringify(str), process.env.PRIVATEKEY).toString();
                console.log(encrypted);
                console.log(res.getHeader('set-cookie'));
                return res.status(200).send(encrypted);
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
                    res.cookie('accessToken',exAdmin.adminId,{
                        expires: new Date(Date.now() + 1000*60*60*24*3),
                        httpOnly: false, // 나중에 secure 및 httpOnly는 true로 바꿔줘야함
                        secure:false,
                        signed:true,
                    });
                    res.cookie('isSuper',0,{
                        expires: new Date(Date.now() + 1000*60*60*24*3),
                        httpOnly: false, // 나중에 secure 및 httpOnly는 true로 바꿔줘야함
                        secure:false
                    });
                    const strName = exAdmin.adminName
                    exAdmin.isLogin = true;
                    await exAdmin.save();
                    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(strName), process.env.PRIVATEKEY).toString();
                    console.log(res.getHeader('set-cookie'));
                    return res.status(200).send(encrypted);
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

/*
    ▼ 관리자 로그아웃을 처리하는 API
    - 최고 관리자인지, 중간 관리자인지 쿠키를 통해 구분한다.
    - 해당 중간 관리자의 로그인 상태를 변경한다. 
    - 이후, 쿠키를 모두 삭제한다.
*/
router.post('/logout', async(req,res)=>{
    try{
        const id = req.signedCookies.accessToken;
        const isSuper = Number(req.cookies.isSuper);
        console.log(id, isSuper);
        const exAdmin = await Admin.findOne({where:{adminId:id}});
        if(exAdmin){
            console.log(`${exAdmin.adminName} logout`);
            exAdmin.isLogin = false;
            await exAdmin.save();
        }
        console.log('로그아웃');
        res.clearCookie('accessToken');
        res.clearCookie('isSuper');
        res.end();
    }catch(err){
        console.error(err);
        res.status(500).send(err.message);
    }
});

/*
    ▼ 사용자 로그인을 처리하는 API
    - 어플에서 보내는 유저ID, PW, VenderId를 통해 JWT 토큰을 생성한다.
    - 유저의 ID가 존재하는지 체크한 후, 암화화된 패스워드를 비교한다.
    - 해당 유저의 venderId의 정보가 비어 있으면 클라이언트로부터 받은 venderId를 저장한다.
    - 이후, JWT 토큰을 발행하여 토큰을 보내준다.
    - 비밀번호, 혹은 Id가 일치하지 않을 경우 오류 메시지를 응답한다.
*/
router.post('/user/login',async(req,res)=>{
    const {userId, userPw, venderId} = req.body;
    console.log(userId, userPw,venderId);
    try{
        const exUserId = await User.findOne({where:{userLoginId:userId}});
        if(exUserId){
            const checkPassword = await bcrypt.compare(userPw,exUserId.userLoginPw);
            if(checkPassword){
                if(!exUserId.vendorId){
                    exUserId.vendorId = venderId;
                    await exUserId.save();
                }
                const token = jwt.sign({
                    userId:exUserId.userId
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:'3 days'
                }
                );
                return res.status(200).send({token});
            }else{
                return res.status(202).send('Do not match password');
            } 
        }else{
            return res.status(202).send('Not exist ID');
        }

    }catch(err){
        console.error(err);
        return res.status(500).send(err.message);
    }
})


module.exports = router;