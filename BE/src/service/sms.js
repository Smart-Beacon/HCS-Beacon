const SmsRecord = require('../db/models/smsRecord');
const AdminDoor = require('../db/models/adminDoor');
const Door = require('../db/models/door');
const Statement = require('../db/models/statement');
const Admin = require('../db/models/admin');
const { getDate, getTime } = require('./time');

const axios = require('axios');
const CryptoJS = require("crypto-js");
const SHA256 = require("crypto-js/sha256");
const Base64 = require("crypto-js/enc-base64");

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

//문자 전송 함수
const sendSMS = async (phoneNum, msg) =>{
    var space = " ";				// one space
	var newLine = "\n";				// new line
	var method = "POST";				// method
	var url = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.SMS_SERVER_ID}/messages`;	// url (include query string)
    var url2 = `/sms/v2/services/${process.env.SMS_SERVER_ID}/messages`;
	var timestamp = Date.now().toString();			// current timestamp (epoch)
	var accessKey = process.env.SMS_ACCESS_KEY_ID;			// access key id (from portal or Sub Account)
	var secretKey = process.env.SMS_SECRET_KEY;			// secret key (from portal or Sub Account)

	var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
	hmac.update(method);
	hmac.update(space);
	hmac.update(url2);
	hmac.update(newLine);
	hmac.update(timestamp);
    hmac.update(newLine);
	hmac.update(accessKey);

	var hash = hmac.finalize();
	const signature = hash.toString(CryptoJS.enc.Base64);

    var newPhoneNum = phoneNum.replace(/\-/g,'');
    console.log(newPhoneNum);
    const option = {
        url: url,
        method: method,
        headers:{
            "Content-Type": "application/json; charset=utf-8",
            "x-ncp-apigw-timestamp": `${timestamp}`,
            "x-ncp-iam-access-key": `${accessKey}`,
            "x-ncp-apigw-signature-v2": `${signature}`,
        },
        data:{
            "type":"SMS",
            "contentType":"COMM",
            "countryCode":"82",
            "from":process.env.FROM_PHONENUM,
            "subject":"본인인증",
            "content":msg,
            "messages":[
                {
                    "to":newPhoneNum,
                }
            ],
        },
    };

    const smsRes = await axios(option);
    return smsRes.data.statusCode;
    // request(option,function (err, res, body) {
    //     if (err) console.log(err);
    //     else {
    //         console.log(body.statusCode);
    //         return body.statusCode;
    //     }
    // });
}

module.exports = {
    getSuperSmsRecord,
    getAdminSmsRecord,
    sendSMS
}