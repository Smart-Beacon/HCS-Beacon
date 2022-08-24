const Admin = require('../db/models/admin');
const SuperAdmin = require('../db/models/superAdmin');


// Check: 최고 관리자 or 중간 관리자 or 모르는 ID 판별하는 함수
const checkAdmin = async(id,isSuper) =>{
    try{
        if(isSuper){
            const exSuperAdmin = await SuperAdmin.findOne({where:{superId:id}});
            if (exSuperAdmin){
                return 0
            }
            return 2
        }else{
            const exAdmin = await Admin.findOne({where:{adminId:id}});
            if (exAdmin){
                return 1
            }
            return 2
        }
    }catch(err){
        return err
    }
    
}



module.exports = {
    checkAdmin
}
