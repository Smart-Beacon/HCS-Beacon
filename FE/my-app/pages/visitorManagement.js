import React from "react";
import Header from "./component/Header";
import css from "styled-jsx/css";
import Link from "next/link";
import axios from "axios";
import {
    Button,
    Select,
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
        display: flex;
        align-items: center;
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
`;

function visitorManagement(){
    
    const header = ["건물명", "출입문명", "ID(비콘)", "출입자", "날짜", "입실시간", "퇴실시간", "방문사유", "출입관리자"]

    const serverData = [
        {
            "a": "본관",
            "b": "전기실",
            "c": "A010101010",
            "d": "박병근",
            "e": "08/30",
            "f": "07:00:00",
            "g": "08:00:00",
            "h": "출근",
            "i": "최재훈"
        },
        {
            "a": "본관",
            "b": "통신실",
            "c": "A010101010",
            "d": "최재훈",
            "e": "08/31",
            "f": "10:00:00",
            "g": "21:00:00",
            "h": "퇴근",
            "i": "최재훈"
        }

    ]

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
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
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                    <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                    <div style={{display: "flex"}}>
                        <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦성명</FormLabel>
                        <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                    </div>
                    </FormControl>
                    <FormControl mt={4} style={{width: '40%'}}>
                    <div style={{display: "flex"}}>
                        <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦전화번호</FormLabel>
                        <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                    </div>
                    </FormControl>
                </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦직장명</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦직책</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                </div>
                </FormControl>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "3%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦ID</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦PW</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}}/>
                </div>
                </FormControl>
            </div>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦건물명</FormLabel>
                <Select placeholder='' width="100%">
                    <option value='option1'>Option 1</option>
                    <option value='option2'>Option 2</option>
                    <option value='option3'>Option 3</option>
                </Select>
            </FormControl>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦출입문명</FormLabel>
                <Select placeholder='' width="100%">
                    <option value='option1'>Option 1</option>
                    <option value='option2'>Option 2</option>
                    <option value='option3'>Option 3</option>
                </Select>
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
                            <li ><Link href = "./ManagementSettings">출입문 관리설정</Link></li>
                            <li><Link href = "./ExitHistory">출입문 입출이력</Link></li>
                            <li className = "Select"><Link href = "#">출입자 관리</Link></li>
                            <li><Link href = "#">출입 관리자</Link></li>
                            <li><Link href = "#">경보 이력</Link></li>
                            <li><Link href = "#">문자발생 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle" style = {{width: "25%",  marginRight: "1%"}}>🟦 출입문 관리</h1>
                            <Input placeholder= "Search Guest Name" style = {{width: "25%"}}/>
                            <div className = "MainHeaderBtn" style = {{width: "70%"}}>
                                <Button onClick={onOpen} colorScheme='green' style = {{float: "right"}}>➕</Button>
                                {modal}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{style}</style>
            
        </div>
    )
}

export default visitorManagement;