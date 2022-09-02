import React, { useState, useEffect } from "react";
import Header from "./component/Header";
import css from "styled-jsx/css";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
    Select
  } from '@chakra-ui/react'


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

    .daySelect ul{
        display: flex;
        list-style: none;
        height: 100%;
        align-items: center;
    }

    .daySelect li:first-child{
        margin-left: 40px;
        margin-right: 40px;
    }

    .daySelect .timeSelect{
        margin-left: 40px;
        height: 100%;
        align-items: center;
        display: flex;
    }
    .daySelect .timeSelect p:first-child{
        margin-right: 1%;
    }

    .daySelect .timeSelect p:not(:first-child){
        margin-left: 1%;
        margin-right: 1%;
    }

    .calenderSelect{
        display: flex;
    }

    .calenderSelect p{
        margin-left: 2.5%;
    }

    .DatePicker{
        width: 12%;
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
      }, [])


    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

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
    }


    const header = ["건물명", "출입문명", "ID(비콘)", "출입자", "날짜", "입실시간", "퇴실시간", "방문사유", "출입관리자"]

    const serverData = [
        {
            "staName": "본관",
            "doorName": "전기실",
            "doorId": "A010101010",
            "userName": "박병근",
            "latestDate": "08/30",
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
            "latestDate": "08/30",
            "enterTime": "07:00:00",
            "exitTime": "08:00:00",
            "reason": "출근",
            "adminName": "최재훈"
        },

    ]

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
                                <p style = {{width: "10%"}}>▶ 날짜 선택 🗓️</p>
                                <div className = "DatePicker">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        showFullMonthYearPicker
                                        showFourColumnMonthYearPicker
                                        />
                                </div> 
                                <div className = "DatePicker">
                                    <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={startDate}
                                                className="red-border"
                                                />    
                                </div> 
                            </div>
                            <div className = "timeSelect">
                                <p>▶ 조회 시간 선택</p>
                                <Select placeholder='Start Time' width="10%">
                                    <option value='option1'>00:00</option>
                                    <option value='option2'>01:00</option>
                                    <option value='option3'>02:00</option>
                                </Select>
                                <p>~</p>
                                <Select placeholder='End Time' width="10%">
                                    <option value='option1'>00:00</option>
                                    <option value='option2'>01:00</option>
                                    <option value='option3'>02:00</option>
                                </Select>
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
                                    {Data.map((item)=>{
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
                                                <td>{item.iadminName}</td>
                                            </tr>
                                        )
                                    })}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{style}</style>
        </div>
    )
}

export default ExitHistory;