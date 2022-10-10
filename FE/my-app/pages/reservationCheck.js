import React, {useState, useEffect} from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import css from "styled-jsx/css";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons"
import axios from "axios";
import {
    Button
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
        flex-direction: row;
        height: 13%;
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

function reservationCheck(){

    useEffect(() => {
        getDoorInfo();
      }, [])


    const header = ["No.", "이름", "전화번호", "날짜", "입실", "퇴실", "출입사유", "자주방문여부", "승인여부"]

    const [Data, setData] = useState([]);
    const [DataClone, setDataClone] = useState(Data);
    const [serverData, setserverData] = useState([
        {
            "allowId" : "Dejong1706",
            "userName": "박병근",
            "phoneNum": "010-3152-1297",
            "latestDate": "2022/08/05",
            "enterTime": "07:00",
            "exitDate": "19:00",
            "reason": "출근을 해야합니다",
            "isAllowed": "Yes",
        },
        {
            "userName": "박병근",
            "phoneNum": "010-3152-1297",
            "latestDate": "2022/08/15",
            "enterTime": "07:00",
            "exitDate": "19:00",
            "reason": "출근을 해야합니다",
            "isAllowed": "Yes",
        },
        {
            "userName": "최재훈",
            "phoneNum": "010-1234-2342",
            "latestDate": "2022/09/01",
            "enterTime": "08:00",
            "exitDate": "20:00",
            "reason": "퇴근을 해야합니다",
            "isAllowed": "Yes",
        }

    ]);
    const [serverDataClone, setserverDataClone] = useState([
        {
            "userName": "박병근",
            "phoneNum": "010-3152-1297",
            "latestDate": "2022/08/05",
            "enterTime": "07:00",
            "exitDate": "19:00",
            "reason": "출근을 해야합니다",
            "isAllowed": "Yes",
        },
        {
            "userName": "박병근",
            "phoneNum": "010-3152-1297",
            "latestDate": "2022/08/15",
            "enterTime": "07:00",
            "exitDate": "19:00",
            "reason": "출근을 해야합니다",
            "isAllowed": "Yes",
        },
        {
            "userName": "최재훈",
            "phoneNum": "010-1234-2342",
            "latestDate": "2022/09/01",
            "enterTime": "08:00",
            "exitDate": "20:00",
            "reason": "퇴근을 해야합니다",
            "isAllowed": "Yes",
        }

    ])
    const [number, setNumber] = useState(0);
    const [isSelected, setIsSelected] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [allow, setAllow] = useState(false);

    const DataLen = [];
    for(let i = 0; i < serverData.length; i++){
        DataLen.push(false);
    }
    const [disabled, setDisabled] = useState(DataLen);

    //시작일 선택시 시작일별 필터링 함수
    const StartDaySearch = (date) => {
        const Month = date.getMonth()+1;
        const Day = date.getDate();
        const startDayresult = DataClone.filter(e => 
            new Date(e.latestDate).getMonth()+1 === Month && 
            new Date(e.latestDate).getDate() === Day);
        setData(startDayresult);
    }
    //시작일 ~ 마지막일 선택시 필터링 함수
    const EndDaySearch = (date) => {
        startDate.setDate(startDate.getDate()-1);
        const endDayresult = DataClone.filter(e => 
            new Date(e.latestDate).getTime() >= startDate.getTime() &&
            new Date(e.latestDate).getTime() <= date.getTime());
        setData(endDayresult);
    }

    const haddleButtonTrue = (e) => {
        setAllow(true);
        e.preventDefault();
        e.currentTarget.disabled = true;
        e.currentTarget.style.color = "white";
        e.currentTarget.style.backgroundColor = "green";
        const disabledClone = [...disabled];
        disabledClone[number] = true;
        setDisabled(disabledClone); 
        setNumber(number+1);
        console.log(allow);
    }

    const haddleButtonFalse = (e) => {
        setAllow(false);
        e.preventDefault();
        e.currentTarget.disabled = true;
        e.currentTarget.style.color = "white";
        e.currentTarget.style.backgroundColor = "red";
        const disabledClone = [...disabled];
        disabledClone[number] = true;
        setDisabled(disabledClone); 
        setNumber(number+1);
    }

    const postInfo = (e) => {
        const trueInfo = {
            "allowId" : e,
            "isAllowed" : allow
        }
        postAllowInfo(trueInfo);
    }

    const getDoorInfo = async () =>{
        const URL = 'http://localhost:5000/user/visitor';
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

    const postAllowInfo = async (item) =>{
        const URL = "http://localhost:5000/user/visitor"
        axios.defaults.withCredentials = true;
            await axios.post(URL, item)
            .then(res => {
                console.log(res);
                if(res.status === 200){
                    console.log("======================", "데이터 전송 성공");
                }else{
                    console.log("false");
                }
            });
    }
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
                            <p style = {{width: "10%"}}>▶ 날짜 선택 🗓️</p> 
                                <div className = "DatePicker" style = {{border: "solid 3px gray", marginRight: "3%", width: "12%"}}> 
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => {
                                            setStartDate(date)
                                            StartDaySearch(date)
                                        }}
                                        dateFormat="yyyy년 MM월 dd일"
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                    />
                                </div>
                                <div className = "DatePicker" style = {{border: "solid 3px gray", width: "12%"}}> 
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => {
                                            setEndDate(date)
                                            EndDaySearch(date)
                                        }}
                                        dateFormat="yyyy년 MM월 dd일"
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className = "TableThead">
                            <table>
                                <thead>
                                    <tr>{header.map((item)=>{
                                        return <th>{item}</th>
                                    })}</tr>
                                </thead>
                            </table>
                        </div>
                        <div className = "tableTbody">
                            <table>
                                <tbody>
                                {Data.map((item, index)=>{
                                            return(
                                                <tr>
                                                    <td>{index+1}</td>
                                                    <td>{item.userName}</td>
                                                    <td>{item.phoneNum}</td>
                                                    <td>{item.latestDate}</td>
                                                    <td>{item.enterTime}</td>
                                                    <td>{item.exitTime}</td>
                                                    <td>{item.reason}</td>
                                                    <td>{item.isAllowed}</td>
                                                    <td>
                                                        <fieldset disabled = {disabled[index]} onChange = {postInfo(item.allowId)}>
                                                            <Button variant='solid' 
                                                        onClick={haddleButtonTrue}
                                                        style = {{marginRight:"7%", backgroundColor: "white", color: "green",
                                                        border: "solid 2px green"}}>
                                                            Y
                                                            </Button>
                                                            <Button variant='solid' style={{backgroundColor: "white", color: "red",
                                                            border: "solid 2px red"}}
                                                           onClick={haddleButtonFalse}>
                                                                N
                                                            </Button>
                                                        </fieldset></td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
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

export default reservationCheck;