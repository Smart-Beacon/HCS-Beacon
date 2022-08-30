import React, {useState} from "react";
import Header from "./component/Header";
import css from "styled-jsx/css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";

import {
    Button,
    Input,
    FormControl,
    FormLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Stack,
    Radio, 
    RadioGroup
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
        height: 15%;
        margin-top: 1%;
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

    .Select{
        color: blue;
    }

    .ModalBody{
        width: 500px;
    }

    .a{
        width: 50%;
    }

    .DateSelect{
        display: flex;
        flex-direction: column;
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
        width: 12.5%;
    }

    table tr td{
        width: 12.5%;
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

function ManagementSettings(){

    const header = ["건물명", "출입문명", "ID(비콘)", "현재상태", "출입관리", "날짜", "개방시간", "폐쇄시간"]

    const serverData = [
        {
            "a": "본관",
            "b": "전기실",
            "c": "A010101010",
            "d": "0",
            "e": "0",
            "f": "08/01",
            "g": "06:00:00",
            "h": "00:00:00",
        },
        {
            "a": "본관",
            "b": "통신실",
            "c": "B010101010",
            "d": "0",
            "e": "0",
            "f": "08/01",
            "g": "06:00:00",
            "h": "00:00:00",
        },
        {
            "a": "본관",
            "b": "사무실",
            "c": "C010101010",
            "d": "0",
            "e": "0",
            "f": "08/01",
            "g": "06:00:00",
            "h": "00:00:00",
        },
        {
            "a": "본관",
            "b": "실험실",
            "c": "D010101010",
            "d": "0",
            "e": "0",
            "f": "08/01",
            "g": "06:00:00",
            "h": "00:00:00",
        }
    ]

    const [Data, setData] = useState([])

    const getDoorInfo = async () =>{
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
    }

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [startDate, setStartDate] = useState(new Date());
    let modal = null;
    modal = <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size = {"6xl"}
      >
        <ModalOverlay />
        <ModalContent style = {{height: "80%"}}>
          <ModalCloseButton />
          <ModalBody pb={6} style = {{width: "80%", margin: "auto", marginTop: "8%"}}>
            <FormControl style={{width: '85%', margin: "auto", marginBottom: "2%"}}>
            <div style={{display: "flex"}}>
                    <FormLabel style={{width: "30%", marginTop: "1%", fontSize: "20px", fontWeight: "bold"}}>🟦담당관리자</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} ref={initialRef}/>
                </div>
            </FormControl>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦건물명</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦건물ID</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                </div>
                </FormControl>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "3%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦도어명</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦도어ID</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                </div>
                </FormControl>
            </div>
            <FormControl mt={4} style = {{width: '85%', margin: "auto", marginBottom: "3%"}}>
              <div style={{display: "flex"}}>
                <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦출입감시여부</FormLabel>
                <RadioGroup defaultValue='2'>
                    <Stack spacing={5} direction='row'>
                        <Radio colorScheme='green' value='1'>
                        Y
                        </Radio>
                        <Radio colorScheme='red' value='2'>
                        N
                        </Radio>
                    </Stack>
                    </RadioGroup>
              </div>
            </FormControl>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦개방일시</FormLabel>
                <ul className=  "DateSelect">
                    <li>날짜 선택 🗓️</li>
                    <li><DatePicker selected={startDate} onChange={date => setStartDate(date)} placeholderText="Start Day"/></li>
                    <li><DatePicker selected={startDate} onChange={date => setStartDate(date)} placeholderText="End Day"/></li>
                </ul>
            </FormControl>
          </ModalBody>

          <ModalFooter style = {{margin: "auto"}}>
            <Button colorScheme='blue' mr={3}>
              저장
            </Button>
            <Button onClick={onClose} colorScheme='blue'>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    return(
        <div>
            <Header/>
            <div className="container">
                <div className="containerBody">
                    <div className = "SideBar">
                        <ul>
                            <li><Link href = "./main">출입문 현황</Link></li>
                            <li className = "Select"><Link href = "#">출입문 관리설정</Link></li>
                            <li><Link href = "./ExitHistory">출입문 입출이력</Link></li>
                            <li><Link href = "./visitorManagement">출입자 관리</Link></li>
                            <li><Link href = "#">출입 관리자</Link></li>
                            <li><Link href = "#">경보 이력</Link></li>
                            <li><Link href = "#">문자발생 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle">🟦 출입문 관리 설정</h1>
                            <Button onClick={onOpen} colorScheme='green'>➕</Button>
                            {modal}
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
                                    {serverData.map((item)=>{
                                        return(
                                            <tr>
                                                <td>{item.a}</td>
                                                <td>{item.b}</td>
                                                <td>{item.c}</td>
                                                <td style = {{color: "red"}}>{item.d}</td>
                                                <td style = {{color: "red"}}>{item.e}</td>
                                                <td>{item.f}</td>
                                                <td style = {{color: "red"}}>{item.g}</td>
                                                <td style = {{color: "blue"}}>{item.h}</td>
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

export default ManagementSettings;