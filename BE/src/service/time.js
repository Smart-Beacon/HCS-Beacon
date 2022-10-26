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

const getTime = (date) => {
    if(date != null){
        var hours = ('0' + date.getUTCHours()).slice(-2); 
        var minutes = ('0' + date.getUTCMinutes()).slice(-2);
        return hours + ':' + minutes;
    }else{
        return "";
    }
    
}

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

module.exports = {
    getDate,
    getTime,
    getTimeSecond,
    getDateHipon
}