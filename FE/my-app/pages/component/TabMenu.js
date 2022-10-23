import React from 'react';
import css from "styled-jsx/css";
import Link from "next/link";

const style = css`
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
    }`;

const TabMenu = ({pageNumber}) => {

    return(
        <>
        <div className="MenuBar">
            <ul className="MenuBarUl">
                <li style = {pageNumber === "1" ? {backgroundColor: "#448aff"} : {backgroundColor : "#bdbdbd;"}}>
                    <Link href="./ExitHistory">출입문 입출이력</Link>
                </li>
                <li style = {pageNumber === "2" ? {backgroundColor: "#448aff"} : {backgroundColor : "#bdbdbd;"}}>
                    <Link href="./reservationCheck">방문자 예약승인</Link>
                </li>
                <li style = {pageNumber === "3" ? {backgroundColor: "#448aff"} : {backgroundColor : "#bdbdbd;"}}>
                    <Link href="./emergencyDoorOpen">비상도어 개방</Link>
                </li>
            </ul>
        </div>
        <style jsx> {style}</style>
        </>
    )
}

export default TabMenu;