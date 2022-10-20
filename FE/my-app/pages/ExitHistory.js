import React, {useState, useEffect} from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import css from "styled-jsx/css";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import ExportExcel from "./component/Excelexport";
import {Cookies} from "react-cookie";
const style = css `
    .container{
        width: 95%;
        height: 80vh;
        margin: auto;
        margin-top: 40px;
        border-top: solid 5px gray;
    }
    
    .containerBody{
        display: flex;
        height: 100%;
    }
    .SideBar{
        width: 15%;
        height: 100%;
    }
    .SideBar ul{
        padding: 0;
        list-style: none;
        text-align: center;
    }
    .SideBar ul li{
        font-size: 30px;
        width: 90%;
        margin-bottom: 15px;
        border-bottom: solid 2px gray;
        font-weight: bold;
    }
    .SideBar ul li:hover{
        color: blue;
    }
    
    .Main{
        width: 85%;
        border-left: solid 5px gray;
        height: 100%;
    }
    .MainHeader{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: solid 4px gray;
        border-bottom: solid 4px gray;
    }
    .MainHeaderTitle{
        font-size: 40px;
        font-weight: bold;
    }
    .icon{
        margin: 0;
        font-size: 50px;
        color: green;
    }
    .MainHeaderTitle{
        margin-left: 30px;
    }
    .Table{
        font-weight: bold;
        font-size: 20px;
    }
    .TableHeader{
        font-size: 20px;
    }
    .Select{
        color: blue;
    }
    .MenuBar{
        height: 8%;
    }
    .MenuBarUl{
        list-style: none;
        height: 100%;
        display: flex;
        margin-left: 30px;
        align-items: flex-end;
    }
    .MenuBarUl li{
        width: 12%;
        border-right: solid 2px #f5f5f5;
        border-left: solid 2px #f5f5f5;
        border-top: solid 2px #f5f5f5;
        background-color: #bdbdbd;
        padding: 8px 18px;
        font-weight: bold;
        border-top-right-radius: 30px;
    }
    .MenuBarUl li:hover{
        background-color: #448aff;
    }
    .daySelect{
        border-bottom: solid 4px gray;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 17%;
        font-weight: bold;
    }
    .calenderSelect{
        display: flex;
    }
    .calenderSelect p{
        margin-left: 2.5%;
    }
    .DatePicker{
        width: 11.5%;
    }
    table{
        width: 100%;
        font-weight: bold;
        font-size: 20px;
        width: 100%;
        margin: 0;
        text-align: center;
    }
    table tr th{
        font-size: 25px;
        width: 11.1%;
    }
    table tr td{
        width: 11.1%;
    }
    .TableThead{
        border-bottom: solid 2px gray;
        margin-bottom: 1%;
    }
    .TableTbody{
        height: 55%;
        overflow: auto;
        text-align: center;
    }
    .TableTbody table tr{
        height: 50px;
    }
`;
const cookies = new Cookies();
function ExitHistory() {
    useEffect(() => {
        getDoorInfo();
        getCookieFunc();
    }, [])
    const [startMonth, setStartMonth] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [MonthView, setMonthView] = useState(false);
    const [DayView, setDayView] = useState(false);
    const [Data, setData] = useState([]);
    const [DataClone, setDataClone] = useState([]);
    // 쿠키값으로 최고관리자인지 일반관리자인지 구분하는 코드
    //------------------------------------------------------------
    const [isSuper, setIsSuper] = useState(false);
    const getCookieFunc = () => {
        if (cookies.get("isSuper") === "1") {
            setIsSuper(true);
        } else {
            setIsSuper(false);
        }
    }
    //------------------------------------------------------------
    // 데이터 받아오는 코드
    //------------------------------------------------------------
    const getDoorInfo = async () => {
        const URL = 'http://localhost:5000/accessrecord';
        axios.defaults.withCredentials = true;
        axios.get(URL).then(res => {
            console.log(res);
            if (res.status === 200) {
                setData(res.data);
                setDataClone(res.data);
            } else {
                alert(res.data);
            }
        });
    }
    //------------------------------------------------------------
    const header = [
        "건물명",
        "출입문명",
        "ID(비콘)",
        "출입자",
        "날짜",
        "입실시간",
        "퇴실시간",
        "방문사유",
        "출입관리자"
    ]
    // 월 선택 시 필터링 월별 필터링 함수
    const MonthSearch = (date) => {
        let year = startMonth.getFullYear();
        let Month = date.getMonth();
        const Monthresult = DataClone.filter(e => new Date(e.enterDate).getFullYear() === year && new Date(e.enterDate).getMonth() === Month);
        setData(Monthresult);
    }
    // 시작일 선택시 시작일별 필터링 함수
    const StartDaySearch = (date) => {
        const year = date.getFullYear();
        const Month = date.getMonth() + 1;
        const Day = date.getDate();
        const startDayresult = DataClone.filter(e => new Date(e.enterDate).getFullYear() === year && new Date(e.enterDate).getMonth() + 1 === Month && new Date(e.enterDate).getDate() === Day);
        setData(startDayresult);
    }
    // 시작일 ~ 마지막일 선택시 필터링 함수
    const EndDaySearch = (date) => { 
        const endDayresult = DataClone.filter(e => {
            const newDate = new Date(e.enterDate);
            newDate.setHours(newDate.getHours() - 9);
            return newDate.getTime() <= date.getTime() && new Date(e.enterDate).getTime() >= startDate.getTime()});
        setData(endDayresult);
    }
    return (<div>
        <Header/>
        <div className="container">
            <div className="containerBody">
                <div className="SideBar">
                    <ul>
                        <li>
                            <Link href="./main">출입문 현황</Link>
                        </li>
                        <li>
                            <Link href="./ManagementSettings">출입문 관리설정</Link>
                        </li>
                        <li className="Select">
                            <Link href="#">출입문 입출이력</Link>
                        </li>
                        <li>
                            <Link href="./visitorManagement">출입자 관리</Link>
                        </li>
                        {
                        isSuper && <li>
                            <Link href="./visitorManager">출입 관리자</Link>
                        </li>
                    }
                        <li>
                            <Link href="./alarmHistory">경보 이력</Link>
                        </li>
                    </ul>
                </div>
                <div className="Main">
                    <div className="MenuBar">
                        <ul className="MenuBarUl">
                            <li style={
                                {backgroundColor: "#448aff"}
                            }>출입문 입출이력</li>
                            <li>
                                <Link href="./reservationCheck">방문자 예약승인</Link>
                            </li>
                            <li>
                                <Link href="./emergencyDoorOpen">비상도어 개방</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="MainHeader">
                        <h1 className="MainHeaderTitle">🟦 출입문 입출 이력</h1>
                        <ExportExcel excelData={Data}
                            fileName={"Excel Export"}/>
                    </div>
                    <div className="daySelect">
                        <div className="calenderSelect">
                            <p style={
                                {width: "10%"}
                            }>▶ 월 선택 🗓️</p>
                            <div className="DatePicker"
                                style={
                                    {
                                        border: "solid 3px gray",
                                        marginRight: "1%"
                                    }
                            }>
                                <DatePicker selected={startMonth}
                                    onChange={
                                        (date) => {
                                            setStartMonth(date)
                                            setDayView(true)
                                            MonthSearch(date);
                                        }
                                    }
                                    dateFormat="yyyy년 MM월"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    showFourColumnMonthYearPicker/>
                            </div>
                        <p style={
                            {width: "10%"}
                        }>▶ 날짜 선택 🗓️</p>
                        <div className="DatePicker"
                            style={
                                {
                                    border: "solid 3px gray",
                                    marginRight: "3%"
                                }
                        }>
                            <DatePicker selected={startDate}
                                onChange={
                                    (date) => {
                                        setStartDate(date)
                                        setMonthView(true)
                                        StartDaySearch(date)
                                    }
                                }
                                dateFormat="yyyy년 MM월 dd일"
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}/>
                        </div>
                    <div className="DatePicker"
                        style={
                            {border: "solid 3px gray"}
                    }>
                        <DatePicker selected={endDate}
                            onChange={
                                (date) => {
                                    setEndDate(date)
                                    EndDaySearch(date)
                                }
                            }
                            dateFormat="yyyy년 MM월 dd일"
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}/>
                    </div>
            </div>
        </div>
        <div className="TableThead">
            <table>
                <thead>
                    <tr> {
                        header.map((item) => {
                            return <th> {item}</th>
                    })
                    }</tr>
                </thead>
            </table>
        </div>
        <div className="TableTbody">
            <table>
                <tbody> {
                    Data.map((item) => {
                        return (<tr>
                            <td> {item.staName}</td>
                            <td> {item.doorName}</td>
                            <td> {item.doorId}</td>
                            <td> {item.userName}</td>
                            <td> {item.enterDate}</td>
                            <td style={{color: "red"}}> {item.enterTime}</td>
                            <td style={{color: "blue"}}> {item.exitTime}</td>
                            <td> {item.reason}</td>
                            <td> {item.adminName}</td>
                        </tr>)
                    })
                } </tbody>
            </table>
        </div>
    </div>
    <UserModal/>
</div></div><style jsx> {style}</style></div>)
}
export default ExitHistory;