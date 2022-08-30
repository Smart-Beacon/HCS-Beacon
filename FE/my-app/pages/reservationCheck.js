import React, {useState} from "react";
import Header from "./component/Header";
import css from "styled-jsx/css";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import {
    Select,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
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
        flex-direction: row;
        height: 17%;
        font-weight: bold;
    }

    .daySelect .timeSelect{
        margin-left: 40px;
        align-items: center;
        width: 100%;
        display: flex;
    }

    .daySelect .timeSelect p:first-child{
        width: 12%;
    }

    .daySelect .timeSelect p:not(:first-child){
        margin-left: 1%;
        margin-right: 1%;
    }

    .daySelect .DatePicker{
        width: 10%;
    }
`;

function reservationCheck(){

    const [startDate, setStartDate] = useState(new Date());
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
                            <li><Link href = "#">출입 관리자</Link></li>
                            <li><Link href = "#">경보 이력</Link></li>
                            <li><Link href = "#">문자발생 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MenuBar">
                            <ul className = "MenuBarUl">
                                <li><Link href = "./ExitHistory">출입문 입출이력</Link></li>
                                <li style= {{backgroundColor: "#448aff"}}>방문자 예약승인</li>
                                <li><Link href  = "./emergencyDoorOpen">비상도어 개방</Link></li>
                            </ul>
                        </div>
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle">🟦 방문자 예약승인</h1>
                            <h1 className = "icon"><FontAwesomeIcon icon={faFileExcel}/></h1>
                        </div>
                        <div className = "daySelect">
                            <div className = "timeSelect">
                                <p>▶ 조회날짜 선택 🗓️</p>
                                <div className = "DatePicker"><DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /></div>
                                <p>▶ 조회 시간 선택</p>
                                <Select placeholder='Start Time' width="10%">
                                    <option value='option1'>Option 1</option>
                                    <option value='option2'>Option 2</option>
                                    <option value='option3'>Option 3</option>
                                </Select>
                                <p>~</p>
                                <Select placeholder='End Time' width="10%">
                                    <option value='option1'>Option 1</option>
                                    <option value='option2'>Option 2</option>
                                    <option value='option3'>Option 3</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{style}</style>
        </div>
    )
}

export default reservationCheck;