import React, {useState, useEffect} from "react";
import Header from "./component/Header";
import css from "styled-jsx/css";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

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
        border-bottom: solid 2px gray;
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

    .Select{
        color: blue;
    }

    .ModalBody{
        width: 500px;
    }

    .a{
        width: 50%;
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

function visitorManagement(){

     useEffect(() => {
        getDoorInfo();
      }, [])

    
    const header = ["No.", "건물명", "출입문명", "ID(비콘)", "발송날짜", "발송시간", "관리자명", "문자발송"]

    const serverData = [
        {
            "a": "1",
            "b": "명품시스템",
            "c": "asdfasdf",
            "d": "1234",
            "e": "2022.0202",
            "f": "Y"
        },
        {
            "a": "1",
            "b": "명품시스템",
            "c": "asdfasdf",
            "d": "1234",
            "e": "2022.0202",
            "f": "Y"
        }

    ]

    useEffect(() => {
        getDoorInfo();
      }, [])

    const [Data, setData] = useState([])

    const getDoorInfo = async () =>{
        const URL = 'http://localhost:5000/alert';
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
                            <li ><Link href = "./ManagementSettings">출입문 관리설정</Link></li>
                            <li><Link href = "./ExitHistory">출입문 입출이력</Link></li>
                            <li><Link href = "./visitorManagement">출입자 관리</Link></li>
                            <li><Link href = "./visitorManager">출입 관리자</Link></li>
                            <li><Link href = "./alarmHistory">경보 이력</Link></li>
                            <li className = "Select"><Link href = "#">문자발생 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle" style = {{width: "25%",  marginRight: "1%"}}>🟦 경보 이력</h1>
                            <h1 className = "icon"><FontAwesomeIcon icon={faFileExcel}/></h1>
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
                                                    <td>{item.staName}</td>
                                                    <td>{item.doorName}</td>
                                                    <td>{item.doorId}</td>
                                                    <td>{item.smsDate}</td>
                                                    <td>{item.smsSendTime}</td>
                                                    <td>{item.adminName}</td>
                                                    <td>{item.isSend}</td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{style}</style>
            
        </div>
    )
}

export default visitorManagement;