import React, { useState, useMemo } from "react";
import {useTable} from "react-table"
import Header from "./component/Header";
import css from "styled-jsx/css";
import Link from "next/link";
import axios from "axios";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
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
    }

    .MainHeaderTitle{
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

    .Table{
        width: 100%;
        font-weight: bold;
        font-size: 20px;
    }

    .TableHeader{
        font-size: 20px;
    }
    
    .Select{
        color: blue;
    }
`;


function Main(){
    const COLUMNS = [
        {
            Header: "건물명",
            accessor: "staName"
        },
        {
            Header: "출입문명",
            accessor: "doorName"
        },
        {
            Header: "ID(비콘)",
            accessor: "doorId"
        },
        {
            Header: "현재상태",
            accessor: "isOpen"
        },
        {
            Header: "개방시간",
            accessor: "opentime"
        },
        {
            Header: "폐쇄시간",
            accessor: "closetime"
        },
        {
            Header: "경보상태",
            accessor: "warnning"
        }
    ]
    
    const serverData = [
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "0"
            },
            {
                "staName" : "본관",
                "doorName" : "통신실",
                "doorId" : "A1010102",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "0"
            },
            {
                "staName" : "본관",
                "doorName" : "기계실",
                "doorId" : "A1010103",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "0"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "0"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "0"
            },
            {
                "staName" : "본관",
                "doorName" : "통신실",
                "doorId" : "A1010102",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "0"
            },
            {
                "staName" : "본관",
                "doorName" : "기계실",
                "doorId" : "A1010103",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "0"
            },
            {
                "staName" : "본관",
                "doorName" : "전기실",
                "doorId" : "A1010101",
                "isOpen" : "0",
                "opentime" : "08:00:00",
                "closetime" : "08:00:00",
                "warnning" : "0"
            }
    ]

    const [Data, setData] = useState([])

    const URL = 'http://localhost:5000/door';
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

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => Data, [])

    const tableInstance = useTable({columns, data})

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;


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
                            <li><Link href = "#">출입 관리자</Link></li>
                            <li><Link href = "#">경보 이력</Link></li>
                            <li><Link href = "#">문자발생 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle">🟦 실시간 감시 현황</h1>
                            <h1 className = "siren">🚨</h1>
                        </div>
                    <div className = "Table">
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                {headerGroups.map((headerGroup) => (
                                    <Tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                        <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
                                    ))}
                                    </Tr>
                                ))}
                                </Thead>
                                <Tbody {...getTableBodyProps()} style = {{textAlign: "center", height: "300px"}}>
                                {rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <Tr style = {{height: "50px"}} {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>;
                                    })}
                                    </Tr>
                                );
                                })}
                            </Tbody>
                            </Table>
                            </TableContainer>
                            {/* ---
                        <table style = {{width: "100%"}}>
                            <thead style = {{borderBottom: "solid 2px gray"}}>
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                                    ))}
                                    </tr>
                                ))}
                            </thead>​
                            <tbody {...getTableBodyProps()} style = {{textAlign: "center"}}>
                                {rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr style = {{height: "50px"}} {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                    })}
                                    </tr>
                                );
                                })}
                            </tbody>​
                        </table> */}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{style}</style>
        </div>
    )
}

export default Main;