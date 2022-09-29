const SmsRecord = require('../db/models/smsRecord');
const AdminDoor = require('../db/models/adminDoor');
const Door = require('../db/models/door');
const Statement = require('../db/models/statement');
const Admin = require('../db/models/admin');
const { getDate, getTime } = require('./time');
const request = require('request');

const transData = async(doorIds,adminName) => {
    const result = await Promise.all(
        doorIds.map(async doorId => {
            const doorData = await Door.findOne({
                where: {doorId:doorId.doorId},
                attributes: ['staId','doorName'],
            });

            const staName = await Statement.findOne({
                where:{staId:doorData.staId},
                attributes:['staName']
            });

            const smsDatas = await SmsRecord.findAll({
                where:{doorId:doorId.doorId}
            });

            const resultRow = await Promise.all(
                smsDatas.map(async data => {
            
                    let smsDate =  getDate(data.sendTime);
                    let smsSendTime = getTime(data.sendTime);

                    const result = {
                        staName:staName.staName,
                        doorName:doorData.doorName,
                        doorId: doorId.doorId,
                        smsDate: smsDate,
                        smsSendTime: smsSendTime,
                        adminName: adminName,
                        isSend: data.isSend
                    };
                    return result
                })
            );
            return resultRow
        })
    );

    return result 
}

const getSuperSmsRecord = async() => {
    const admin = await Admin.findAll({
        attributes: ['adminId', 'adminName'],
    });

    const superDates = await Promise.all(
        admin.map(async adminData =>{
            const doorIds = await AdminDoor.findAll({
                where: {adminId:adminData.adminId},
                attributes: ['doorId'],
            });

            const doorDatas = await transData(doorIds,adminData.adminName);
            return doorDatas.flatMap(data => data);
        })
    );
    const finalResult = superDates.flatMap(data => data);
    const sortedResult = finalResult.sort((a, b) => new Date(b.alertDate)-new Date(a.alertDate));
    
    return sortedResult;
}

const getAdminSmsRecord = async(id) => {

    const admin = await Admin.findOne({
        where:{adminId:id},
        attributes: ['adminName'],
    });

    const doorIds = await AdminDoor.findAll({
        where: {adminId:id},
        attributes: ['doorId'],
    });

    const doorDatas = await transData(doorIds,admin.adminName);

    const finalResult = doorDatas.flatMap(data => data);
    const sortedResult = finalResult.sort((a, b) => new Date(b.alertDate)-new Date(a.alertDate));

    return sortedResult;
};
const sendAppLinkSMS = async(body) => {
    let msg = "";// 어플 주소
    let phoneNum = body.phoneNum;
    const result = sendSMS(phoneNum, msg);
};
//문자 전송 함수
const sendSMS = async(phoneNum, msg) =>{
    let sms_url = "https://sslsms.cafe24.com/sms_sender.php"; // HTTPS 전송요청 URL
    //sms_url = "http://sslsms.cafe24.com/sms_sender.php";
    const params = {
        "user_id": Buffer.from(process.env.CAFE24_USER_ID, "utf8").toString('base64'),
        "secure": Buffer.from(process.env.CAFE24_SECURE_KEY, "utf8").toString('base64'),
        "sphone1": Buffer.from(process.env.CAFE24_SPHONE1, "utf8").toString('base64'),
        "sphone2": Buffer.from(process.env.CAFE24_SPHONE2, "utf8").toString('base64'),
        "sphone3": Buffer.from(process.env.CAFE24_SPHONE3, "utf8").toString('base64'),
        "rphone": Buffer.from(phoneNum, "utf8").toString('base64'),
        "destination": Buffer.from('', "utf8").toString('base64'),
        "title" : Buffer.from('', "utf8").toString('base64'),
        "msg": Buffer.from(msg, "utf8").toString('base64'),
        "rdate": Buffer.from('', "utf8").toString('base64'),
        "rtime": Buffer.from('', "utf8").toString('base64'),
        "returnurl": Buffer.from('', "utf8").toString('base64'),
        "testflag": Buffer.from("Y", "utf8").toString('base64'), 
        "nointeractive": Buffer.from('', "utf8").toString('base64'),
        "repeatFlag": Buffer.from('', "utf8").toString('base64'),
        "repeatNum": Buffer.from('', "utf8").toString('base64'),
        "repeatTime": Buffer.from('', "utf8").toString('base64'),
    };

    const datas = {
        "user_id": process.env.CAFE24_USER_ID,
        "secure": process.env.CAFE24_SECURE_KEY,
        "sphone1": process.env.CAFE24_SPHONE1,
        "sphone2": process.env.CAFE24_SPHONE2,
        "sphone3": process.env.CAFE24_SPHONE3,
        "rphone": phoneNum,
        "destination": '',
        "title" : '',
        "msg": msg,
        "rdate": '',
        "rtime": '',
        "returnurl": '',
        "testflag": "Y",
        "nointeractive": '',
        "repeatFlag": '', 
        "repeatNum": '',
        "repeatTime": '',
    };

    const option = {
        uri: sms_url,
        method: "POST",
        form: datas,
    }
    var smsRequest = await request.post(option,function(err, res, body) {
        if(err){    
            //console.log(err);
        }else{
            console.log(body);
            //console.log(body);
        }
    });
}

module.exports = {
    getSuperSmsRecord,
    getAdminSmsRecord,
    sendSMS
}