/*
    ▼ 날짜 포멧 함수
    - 날짜를 YYYY.MM.DD 형식으로 바꿔 리턴하는 함수
*/
const getDate = (date) => {
    if(date != null){
        var alertYear = date.getFullYear();
        var alertMonth = ('0' + (date.getUTCMonth() + 1)).slice(-2);
        var alertDay = ('0' + date.getUTCDate()).slice(-2);

        return alertYear + '.' + alertMonth + '.' + alertDay;
    }else{
        return '';
    }
}

/*
    ▼ 날짜 포멧 함수
    - 날짜를 YYYY-MM-DD 형식으로 바꿔 리턴하는 함수
*/
const getDateHipon = (date) =>{
    if(date != null){
        let alertYear = date.getFullYear();
        let alertMonth = ('0' + (date.getUTCMonth() + 1)).slice(-2);
        let alertDay = ('0' + date.getUTCDate()).slice(-2);

        return alertYear + '-' + alertMonth + '-' + alertDay;
    }else{
        return '';
    }
}


/*
    ▼ 시간 포멧 함수
    - 시간을 HH:MM 형식으로 바꿔 리턴하는 함수
*/
const getTime = (date) => {
    if(date != null){
        var hours = ('0' + date.getUTCHours()).slice(-2); 
        var minutes = ('0' + date.getUTCMinutes()).slice(-2);
        return hours + ':' + minutes;
    }else{
        return "";
    }
    
}

/*
    ▼ 시간 포멧 함수
    - 시간을 HH:MM:SS 형식으로 바꿔 리턴하는 함수
*/
const getTimeSecond = (date) =>{
    if(date != null){
        var hours = ('0' + date.getUTCHours()).slice(-2); 
        var minutes = ('0' + date.getUTCMinutes()).slice(-2);
        var seconds = ('0' + date.getUTCSeconds()).slice(-2);
        return hours + ':' + minutes + ':' + seconds;
    }else{
        return '';
    }
}


//외부에서 사용할 수 있게 내보내기
module.exports = {
    getDate,
    getTime,
    getTimeSecond,
    getDateHipon
}