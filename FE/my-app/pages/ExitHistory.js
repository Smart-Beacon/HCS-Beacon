import React, {useState, useEffect} from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import SideBar from "./component/SideBar";
import TabMenu from "./component/TabMenu";
import css from "styled-jsx/css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import ExportExcel from "./component/Excelexport";
import {Cookies} from "react-cookie";
import { getHours } from "date-fns";

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
        const URL = `${process.env.NEXT_PUBLIC_HOST_ADDR}/accessrecord`;
        axios.defaults.withCredentials = true;
        axios.get(URL).then(res => {
            // console.log(res);
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
            startDate.setHours(0,0,0,0);             
            return newDate.getTime() <= date.getTime() && newDate.getTime() >= startDate.getTime()});
        setData(endDayresult);
    }
    return (<div>
        <Header/>
        <div className="container">
            <div className="containerBody">
                <SideBar pageNumber = "3" isSuper = {isSuper}/>
                <div className="Main">
                    <TabMenu pageNumber = "1"/>
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
                                        marginRight: "1%",
                                        width: "13%"
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
                                    marginRight: "3%",
                                    width: "13%"
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
                            {border: "solid 3px gray",
                            width: "13%"}
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
                        header.map((item, index) => {
                            return <th key = {index}> {item}</th>
                    })
                    }</tr>
                </thead>
            </table>
        </div>
        <div className="TableTbody">
            <table>
                <tbody> {
                    Data.map((item, index) => {
                        return (<tr key = {index}>
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