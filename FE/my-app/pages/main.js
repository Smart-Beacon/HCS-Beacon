import React, { useState, useMemo, useEffect } from "react";
import Header from "./component/Header";
import css from "styled-jsx/css";
import Link from "next/link";
import axios from "axios";


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
    }

    .MainHeaderTitle{
        margin-top: 1.5%;
        font-size: 40px;
        font-weight: bold;
    }

    .siren{
        margin: 0;
        font-size: 80px;
    }

    .MainHeaderTitle{
        margin-left: 30px;
    }

    .TableHeader{
        font-size: 20px;
    }
    
    .Select{
        color: blue;
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
        width: 14.3%;
    }

    table tr td{
        width: 14.3%;
    }

    .TableThead{
        padding-right: 1.27%;
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


function Main(){

    useEffect(() => {
        getDoorInfo();
      }, [])


    const header = ["건물명", "출입문명", "ID(비콘)", "현재상태", "개방시간", "폐쇄시간", "경보상태"]
    
    const serverData = [
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "통신실",
                "doorId" : "A1010102",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "기계실",
                "doorId" : "A1010103",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "False"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "통신실",
                "doorId" : "A1010102",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "기계실",
                "doorId" : "A1010103",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "False"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "False"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "False"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "False"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "False"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "True"
            }
    ]

    const [Data, setData] = useState([])

    const getDoorInfo = async () =>{
        const URL = 'http://localhost:5000/door/monitor';
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

    let warning_boolean = "";

    return(
        <div>
            <Header/>
            <div className="container">
                <div className="containerBody">
                    <div className = "SideBar">
                        <ul>
                            <li className = "Select"><a href = "#">출입문 현황</a></li>
                            <li><Link href = "./ManagementSettings">출입문 관리설정</Link></li>
                            <li><Link href = "./ExitHistory">출입문 입출이력</Link></li>
                            <li><Link href = "./visitorManagement">출입자 관리</Link></li>
                            <li><Link href = "./visitorManager">출입 관리자</Link></li>
                            <li><Link href = "./alarmHistory">경보 이력</Link></li>
                            <li><Link href = "./smsHistory">문자발생 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle">🟦 실시간 감시 현황</h1>
                            <h1 className = "siren">🚨</h1>
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
                                        if(item.warnning === "True"){
                                            warning_boolean = "1";
                                        }else{
                                            warning_boolean = "0";
                                        }
                                        return(
                                            <tr>
                                                <td>{item.staName}</td>
                                                <td>{item.doorName}</td>
                                                <td>{item.doorId}</td>
                                                <td>{String(item.isOpen)}</td>
                                                <td style = {{color: "blue"}}>{item.openTime}</td>
                                                <td style = {{color: "red"}}>{item.closeTime}</td>
                                                <td>{warning_boolean}</td>
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

export default Main;
