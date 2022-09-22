import React, { useState, useEffect } from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import css from "styled-jsx/css";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {setHours, setMinutes} from "date-fns";

const style = css`
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
        height: 17%;
        font-weight: bold;
    }

    .calenderSelect{
        display: flex;
        margin-top: 1.5%;
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
        height: 65%;
        overflow: auto;
        text-align: center;
    }

    .TableTbody table tr{
        height: 50px;
    }

`;

function ExitHistory(){

    useEffect(() => {
        getDoorInfo();
        setserverDataClone(serverData);
      }, [])

    const [serverData, setserverData] = useState([
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박병근",
            "latestDate": "2022-08-30",
            "enterTime": "07:00:00",
            "exitTime": "08:00:00",
            "reason": "출근",
            "adminName": "최재훈"
        },
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박병근",
            "latestDate": "2022-08-05",
            "enterTime": "07:00:00",
            "exitTime": "08:00:00",
            "reason": "출근",
            "adminName": "최재훈"
        },
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박병근",
            "latestDate": "2022-09-30",
            "enterTime": "07:00:00",
            "exitTime": "08:00:00",
            "reason": "출근",
            "adminName": "최재훈"
        },
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박병근",
            "latestDate": "2022-10-30",
            "enterTime": "07:00:00",
            "exitTime": "08:00:00",
            "reason": "출근",
            "adminName": "최재훈"
        },
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박진희",
            "latestDate": "2022-10-25",
            "enterTime": "07:00:00",
            "exitTime": "08:00:00",
            "reason": "출근",
            "adminName": "이은정"
        },
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박병근",
            "latestDate": "2022-07-09",
            "enterTime": "05:00:00",
            "exitTime": "10:00:00",
            "reason": "출근",
            "adminName": "최재훈"
        },
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박병근",
            "latestDate": "2022-07-07",
            "enterTime": "06:00:00",
            "exitTime": "09:00:00",
            "reason": "출근",
            "adminName": "최재훈"
        },
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박병근",
            "latestDate": "2022-07-01",
            "enterTime": "14:00:00",
            "exitTime": "20:00:00",
            "reason": "출근",
            "adminName": "최재훈"
        },
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박병근",
            "latestDate": "2022-01-30",
            "enterTime": "07:00:00",
            "exitTime": "08:00:00",
            "reason": "출근",
            "adminName": "최재훈"
        },

    ])
    const [serverDataClone, setserverDataClone] = useState([]);
    const [startMonth, setStartMonth] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const [MonthView , setMonthView] = useState(false);
    const [DayView , setDayView] = useState(false);

    const onSelect = (time) => {
        setStartTime(time);
        setIsSelected(true);
        setEndTime(null);
    };

    const [Data, setData] = useState([])

    const getDoorInfo = async () =>{
        const URL = 'http://localhost:5000/accessrecord';
        axios.defaults.withCredentials = true;
        axios.get(URL)
        .then(res => {
            console.log(res);
            if(res.status === 200){
                setData(res.data);           
            }else{
                alert(res.data);
            }
     });
    } //데이터 받아오는 코드

    const header = ["건물명", "출입문명", "ID(비콘)", "출입자", "날짜", "입실시간", "퇴실시간", "방문사유", "출입관리자"]

    //월 선택 시 필터링 월별 필터링 함수
    const MonthSearch = (date) => {
        let year = startMonth.getFullYear();
        let Month = date.getMonth();
        const Monthresult = serverDataClone.filter(e => 
            new Date(e.latestDate).getFullYear() === year && new Date(e.latestDate).getMonth() === Month);
        setserverData(Monthresult);
    }
    //시작일 선택시 시작일별 필터링 함수
    const StartDaySearch = (date) => {
        const year = date.getFullYear();
        const Month = date.getMonth()+1;
        const Day = date.getDate();
        const startDayresult = serverDataClone.filter(e => 
            new Date(e.latestDate).getFullYear() === year && 
            new Date(e.latestDate).getMonth()+1 === Month && 
            new Date(e.latestDate).getDate() === Day);
        setserverData(startDayresult);
    }
    //시작일 ~ 마지막일 선택시 필터링 함수
    const EndDaySearch = (date) => {
        const year = date.getFullYear();
        const Month = date.getMonth()+1;
        const endDayresult = serverDataClone.filter(e => 
            new Date(e.latestDate).getFullYear() === year && 
            new Date(e.latestDate).getMonth()+1 === Month && 
            new Date(e.latestDate).getTime() <= date.getTime() &&
            new Date(e.latestDate).getTime() >= startDate.getTime());
        setserverData(endDayresult);
        }

    /*const TimeSearch = (time) => {
        const start = startTime;
        const end = time;
        const Timeresult = serverData.filter(e => 
            new Date(e.enterTime).getTime() >= start.getTime() && new Date(e.exitTime).getTime() <= end.getTime());
        setserverData(Timeresult);
    }*/

    return(
        <div>
            <Header/>
            <div className="container">
                <div className="containerBody">
                    <div className = "SideBar">
                        <ul>
                            <li><Link href = "./main">출입문 현황</Link></li>
                            <li><Link href = "./ManagementSettings">출입문 관리설정</Link></li>
                            <li className = "Select"><Link href = "#">출입문 입출이력</Link></li>
                            <li><Link href = "./visitorManagement">출입자 관리</Link></li>
                            <li><Link href = "./visitorManager">출입 관리자</Link></li>
                            <li><Link href = "./alarmHistory">경보 이력</Link></li>
                            <li><Link href = "./smsHistory">문자발생 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MenuBar">
                            <ul className = "MenuBarUl">
                                <li style= {{backgroundColor: "#448aff"}}>출입문 입출이력</li>
                                <li><Link href = "./reservationCheck">방문자 예약승인</Link></li>
                                <li><Link href  = "./emergencyDoorOpen">비상도어 개방</Link></li>
                            </ul>
                        </div>
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle">🟦 출입문 입출 이력</h1>
                            <h1 className = "icon"><FontAwesomeIcon icon={faFileExcel}/></h1>
                        </div>
                        <div className = "daySelect">                                      
                            <div className = "calenderSelect">
                                <p style = {{width: "10%"}}>▶ 월 선택 🗓️</p>
                                <div className = "DatePicker" style = {{border: "solid 3px gray", marginRight: "1%"}}>
                                    <DatePicker
                                        selected={startMonth}
                                        onChange={(date) => {
                                            setStartMonth(date)
                                            setDayView(true)
                                            MonthSearch(date);
                                        }}
                                        dateFormat="yyyy년 MM월"
                                        disabled = {MonthView}
                                        showMonthYearPicker
                                        showFullMonthYearPicker
                                        showFourColumnMonthYearPicker
                                        />
                                </div>
                                <p style = {{width: "10%"}}>▶ 날짜 선택 🗓️</p> 
                                <div className = "DatePicker" style = {{border: "solid 3px gray", marginRight: "3%"}}> 
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => {
                                            setStartDate(date)
                                            setMonthView(true)
                                            StartDaySearch(date)
                                        }}
                                        dateFormat="yyyy년 MM월 dd일"
                                        selectsStart
                                        disabled = {DayView}
                                        startDate={startDate}
                                        endDate={endDate}
                                    />
                                </div>
                                <div className = "DatePicker" style = {{border: "solid 3px gray"}}> 
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => {
                                            setEndDate(date)
                                            EndDaySearch(date)}}
                                        dateFormat="yyyy년 MM월 dd일"
                                        selectsEnd
                                        disabled = {DayView}
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                    />
                                </div> 
                            </div>
                            <div className = "timeSelect">
                                <ul className=  "DateSelect" style = {{display: "flex", width: "100%",listStyle: "none", alignItems: "center"
                                                            ,marginTop: "1%", marginLeft: "2.5%"}}>
                                    <li style = {{width: "10%"}}>▶ 시간 선택</li>
                                    <li style = {{border: "solid 3px gray"}}><div><DatePicker
                                                    selected={startTime}
                                                    onChange={onSelect}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={30}
                                                    minTime={setHours(setMinutes(new Date(), 0), 0)}
                                                    maxTime={setHours(setMinutes(new Date(), 30), 23)}
                                                    timeCaption="Time"
                                                    dateFormat="aa h:mm 시작"
                                                    placeholderText="start time"
                                                    className="mt-4"
                                                /></div></li>
                                        {isSelected ? // 시작 시간을 선택해야 종료 시간 선택 가능
                                        <li style = {{border: "solid 3px gray", marginLeft: "5%"}}> 
                                            <div><DatePicker
                                            selected={endTime}
                                            onChange={(time) => {
                                                setEndTime(time)
                                                //TimeSearch(time)
                                            }}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={30}
                                            minTime={startTime}
                                            maxTime={setHours(setMinutes(new Date(), 30), 23)}
                                            excludeTimes={[
                                                // 시작 시간 제외
                                                startTime,
                                            ]}
                                            timeCaption="Time"
                                            dateFormat="aa h:mm 종료"
                                            placeholderText="end time"
                                            className="mt-3"
                                        /></div>
                                        </li>
                                        : null 
                                        }
                                </ul>
                            </div>
                        </div>
                        <div className = "TableThead">
                            <table>
                                <tr>{header.map((item)=>{
                                    return <th>{item}</th>
                                })}</tr>
                            </table>
                        </div>
                        <div className = "TableTbody">
                            <table>
                                    {serverData.map((item)=>{
                                        return(
                                            <tr>
                                                <td>{item.staName}</td>
                                                <td>{item.doorName}</td>
                                                <td>{item.doorId}</td>
                                                <td>{item.userName}</td>
                                                <td>{item.latestDate}</td>
                                                <td style = {{color: "red"}}>{item.enterTime}</td>
                                                <td style = {{color: "blue"}}>{item.exitTime}</td>
                                                <td>{item.reason}</td>
                                                <td>{item.adminName}</td>
                                            </tr>
                                        )
                                    })}
                            </table>
                        </div>
                    </div>
                    <UserModal/>
                </div>
            </div>
            <style jsx>{style}</style>
        </div>
    )
}

export default ExitHistory;