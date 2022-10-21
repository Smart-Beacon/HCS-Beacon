import React from 'react';
import css from "styled-jsx/css";
import Link from "next/link";

const style = css`
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
    `;

const SideBar = ({pageNumber}) => {

    return(
        <>
        <div className="SideBar">
            <ul>
                <li style = {pageNumber === "1" ? {color: "blue"} : {color: "black"}}>
                    <Link href="./main">출입문 현황</Link>
                </li>
                <li style = {pageNumber === "2" ? {color: "blue"} : {color: "black"}}>
                    <Link href="./ManagementSettings">출입문 관리설정</Link>
                </li>
                <li style = {pageNumber === "3" ? {color: "blue"} : {color: "black"}}>
                    <Link href="./ExitHistory">출입문 입출이력</Link>
                </li>
                <li style = {pageNumber === "4" ? {color: "blue"} : {color: "black"}}>
                    <Link href="./visitorManagement">출입자 관리</Link>
                </li>
                {/* {isSuper && <li>
                    <Link href="./visitorManager">출입 관리자</Link>
                </li>} */}
                <li style = {pageNumber === "6" ? {color: "blue"} : {color: "black"}}>
                    <Link href="./alarmHistory">경보 이력</Link>
                </li>
            </ul>
        </div>
        <style jsx> {style}</style>
        </>
    )
}

export default SideBar;