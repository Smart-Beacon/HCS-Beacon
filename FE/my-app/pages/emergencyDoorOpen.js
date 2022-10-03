import React, {useState, useEffect} from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import css from "styled-jsx/css";
import Link from "next/link";
import axios from "axios";
import {
    Checkbox,
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
        flex-direction: row;
        height: 10%;
        font-weight: bold;
    }

    .daySelect .timeSelect{
        margin-left: 40px;
        align-items: center;
        width: 100%;
        display: flex;
    }

    .daySelect .timeSelect p:first-child{
        margin-right: 1%;
    }

    .daySelect .timeSelect p:not(:first-child){
        margin-left: 1%;
        margin-right: 1%;
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

function emergencyDoorOpen(){

    useEffect(() => {
        getDoorInfo();
      }, [])


    const header = ["No.", "시설명", "도어명", "개방여부"]
    
    const [serverData, setserverData] = useState([
        {
            "staName" : "공과대학",
            "doorName" : "1층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "이과대학",
            "doorName" : "1층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "공과대학",
            "doorName" : "3층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "공과대학",
            "doorName" : "4층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "법정대학",
            "doorName" : "1층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "의과대학",
            "doorName" : "1층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        
    ])

    const [serverDataClone, setserverDataClone] = useState([
        {
            "staName" : "공과대학",
            "doorName" : "1층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "이과대학",
            "doorName" : "1층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "공과대학",
            "doorName" : "3층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "공과대학",
            "doorName" : "4층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "법정대학",
            "doorName" : "1층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        {
            "staName" : "의과대학",
            "doorName" : "1층 사무실",
            "doorId" : "A001",
            "isOpen" : "Open"
        },
        
    ])

    const [staDoorData, setStaDoorData] = useState({
        "staData":[       
        {
            "staId" : 1,
            "staName": "공과대학"
        },
        {
            "staId" : 2,
            "staName": "이과대학"
        },
        {
            "staId" : 3,
            "staName": "의과대학"
        },
        {
            "staId" : 4,
            "staName": "문과대학"
        },
    ],
    "doorData":[    
        {
            "doorId": "A1",
            "doorName": "사무실",
            "staId": 1
        },
        {
            "doorId": "A1",
            "doorName": "PC실A",
            "staId": 2
        },
        {
            "doorId": "A1",
            "doorName": "PC실B",
            "staId": 3
        },
        {
            "doorId": "A1",
            "doorName": "사무실",
            "staId": 4
        },
        {
            "doorId": "A1",
            "doorName": "창고",
            "staId": 4
        },
    ]});
    
    const [Data, setData] = useState([]);
    const [Selected, setSelected] = useState("");


    const handleFilter = async (e) => {
        setSelected(e.target.value);
        const result =  serverDataClone.filter(e => Selected === e.staName);
        setserverData(result);
    };

    const getInfo = async () =>{
        const URL = 'http://localhost:5000/door/adminemergency';
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

    const getDoorInfo = async () =>{
        const URL = 'http://localhost:5000/statement';
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
                                <li><Link href = "./reservationCheck">방문자 예약승인</Link></li>
                                <li style= {{backgroundColor: "#448aff"}}>비상도어 개방</li>
                            </ul>
                        </div>
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle">🟦 비상도어 개방</h1>
                        </div>
                        <div className = "daySelect">
                            <div className = "timeSelect">
                                <p>▶ 전체도어 개방</p>
                                <Checkbox></Checkbox>
                                <p>▶ 관리 시설 선택</p>
                                <Select placeholder='Select Gate' 
                                onChange={(e) => {
                                    handleFilter(e)
                                }}
                                value={Selected} width="20%">
                                    {staDoorData.staData.map((item) => (
                                        <option value={item.staName} key={item.staId}>
                                        {item.staName}
                                        </option>
                                    ))}
                                </Select>
                                <Checkbox style = {{marginLeft: "1%"}}></Checkbox>
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
                        <div className = "TableTbody">
                            <table>
                                <tbody>
                                {serverData.map((item, index)=>{
                                            return(
                                                <tr>
                                                    <td>{index+1}</td>
                                                    <td>{item.staName}</td>
                                                    <td>{item.doorName}</td>
                                                    <td><Checkbox></Checkbox></td>
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

export default emergencyDoorOpen;