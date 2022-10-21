import React, {useState, useEffect, useCallback} from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import css from "styled-jsx/css";
import SideBar from "./component/SideBar";
import Link from "next/link";
import axios from "axios";
import ExportExcel from "./component/Excelexport";
import { Cookies } from "react-cookie";

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

const cookies = new Cookies();

function visitorManagement(){

     useEffect(() => {
        getDoorInfo();
        getCookieFunc();
      }, [])

      const [isSuper, setIsSuper] = useState(false);

    const getCookieFunc = () => {
            if(cookies.get("isSuper") === "1"){
                setIsSuper(true);
            }else{
                setIsSuper(false);
            }
        }

    
    const header = ["No.", "건물명", "출입문명", "ID(비콘)", "경보날짜", "경보시간", "담당관리자"]

    useEffect(() => {
        getDoorInfo();
      }, [])

    const [Data, setData] = useState([]);

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
                    <SideBar pageNumber = "6"/>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle" style = {{width: "25%",  marginRight: "1%"}}>🟦 경보 이력</h1>
                            <ExportExcel excelData={Data} fileName={"Excel Export"}/>
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
                                {Data.map((item, index)=>{
                                            return(
                                                <tr>
                                                    <td>{index+1}</td>
                                                    <td>{item.staName}</td>
                                                    <td>{item.doorName}</td>
                                                    <td>{item.doorId}</td>
                                                    <td>{item.alertDate}</td>
                                                    <td>{item.alertTime}</td>
                                                    <td>{item.adminName}</td>
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

export default visitorManagement;