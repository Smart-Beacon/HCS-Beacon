const Door = require('../db/models/door');
const AdminDoor = require('../db/models/adminDoor');
const User = require('../db/models/user');
const UserAllow = require('../db/models/userAllow');

// GET : 출입자 관리 데이터
// 모든 건물의 출입자 데이터를 확인하는 함수
// 최고 관리자만 사용하는 함수
// 성명, 전화번호, 소속, 직책, 건물명, 출입문명, 방문일시, 방문허가
const getSuperUserAllows = async() => {
    
}