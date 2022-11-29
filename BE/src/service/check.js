//  ▼ BE/src/db/models 에 위치한 모델 파일을 각각 클래스 형태로 불러온다.
const Admin = require('../db/models/admin');
const SuperAdmin = require('../db/models/superAdmin');

/*
    ▼ 최고 관리자인지 중간 관리자인지 판별하는 함수
    - Cookie에 들어있던 관리자의 Id와 isSuper를 매개변수로 받는다.
    - isSuper값이 1이면 관리자 Id를 최고 관리자 DB에서 검색을 한다.
    - isSuper값이 0이면 관리자 Id를 중간 관리자 DB에서 검색을 한다.
    - 이후 관리자가 존재할 시, 최고관리자는 0을 중간관리자는 1을 리턴한다.
    - 아예 존재하지 않을 시 2를 리턴한다.
*/
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

//외부에서 사용할 수 있게 내보내기
module.exports = {
    checkAdmin
}