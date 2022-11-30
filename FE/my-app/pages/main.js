import React, {useState, useEffect} from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import SideBar from "./component/SideBar";
import css from "styled-jsx/css";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
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
const cookies = new Cookies();
function Main() {
    useEffect(() => {
        getDoorInfo();
        getCookieFunc();
    }, []);
    const header = [
        "건물명",
        "출입문명",
        "ID(비콘)",
        "현재상태",
        "개방시간",
        "폐쇄시간",
        "경보상태"
    ];
    const [warningCnt, setWarningCnt] = useState([]);   //경보상태가 1인지 아닌지 확인하는 useState
    //쿠키로 최고관리자, 일반관리자를 확인하는 코드
    const [isSuper, setIsSuper] = useState(false);
    const getCookieFunc = () => {
        if (cookies.get("isSuper") === "1") {
            setIsSuper(true);
        } else {
            setIsSuper(false);
        }
    }
    //
    const [Data, setData] = useState([])
    const getDoorInfo = async () => {
        const URL = `${process.env.NEXT_PUBLIC_HOST_ADDR}/door/monitor`;
        axios.defaults.withCredentials = true;
        axios.get(URL).then(res => {
            if (res.status === 200) {
                setData(res.data);
                const warningArray = res.data.map(e => e.warning);
                setWarningCnt(warningArray);
            } else {
                alert(res.data);
            }
        });
    }
    return (<div>
        <Header/>
        <div className="container">
            <div className="containerBody">
                <SideBar pageNumber = "1" isSuper = {isSuper}/>
                <div className="Main">
                    <div className="MainHeader">
                        <h1 className="MainHeaderTitle">🟦 실시간 감시 현황</h1>
                        <h1 className="siren"><FontAwesomeIcon style={warningCnt.includes(true) ? {color: "red"} : {color: "green"}}
                                icon={faTriangleExclamation}/></h1>
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
                                    return (
                                    <tr key = {index}>
                                        <td>{item.staName}</td>
                                        <td>{item.doorName}</td>
                                        <td>{item.doorId}</td>
                                        <td>{Number(item.isOpen)}</td>
                                        <td style = {{color: "blue"}}>{item.openTime}</td>
                                        <td style = {{color: "red"}}>{item.closeTime}</td>
                                        <td>{Number(item.warning)}</td>
                                    </tr>)
                                })
                            } </tbody>
                        </table>
                    </div>
                </div>
                <UserModal/>
            </div>
        </div>
        <style jsx> {style}</style>
    </div>)
}
export default Main;