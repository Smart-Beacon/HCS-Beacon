import React, {useState, useEffect} from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
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

    
    const header = ["No.", "소속", "관리자이름", "ID", "전화번호", "등록일자", "로그인 상태", "문자수신"]

    useEffect(() => {
        getDoorInfo();
      }, [])

    const [Data, setData] = useState([])

    const getDoorInfo = async () =>{
        const URL = 'http://localhost:5000/super/admins';
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

    const [serverData, setserverData] = useState([
        {
            "company": "명품시스템",
            "adminName": "박병근",
            "adminLoginId": "Dejong1706",
            "phoneNum": "010-3152-1297",
            "createdAt": "2022.02.02",
            "isLogin": "Y",
            "sms": "Y"
        },
        {
            "company": "명품시스템",
            "adminName": "김민성",
            "adminLoginId": "MinSung",
            "phoneNum": "010-1234-1234",
            "createdAt": "2022.03.12",
            "isLogin": "Y",
            "sms": "N"
        }

    ])
    const [company, setCompany] = useState("");
    const [adminName, setAdminName] = useState("");
    const [adminLoginId, setAdminLoginId] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [adminLoginPw, setAdminLoginPw] = useState("");
    const [position , setPosition ] = useState("");

    const handlecompany = (e) => setCompany(e.target.value);
    const handleadminName = (e) => setAdminName(e.target.value);
    const handleadminLoginId = (e) => setAdminLoginId(e.target.value);
    const handlephoneNum = (e) => setPhoneNum(e.target.value);
    const handleadminLoginPw = (e) => setAdminLoginPw(e.target.value);
    const handleposition = (e) => setPosition(e.target.value);   

    const addInfo = () => {

        const nowDate = new Date();
        const year = nowDate.getFullYear();
        const Month = String(nowDate.getMonth()+1).padStart(2, "0");
        const Day = nowDate.getDate();

        const now = year + "." + Month + "." + Day;

        const info = {
            "company": company,
            "position": position,
            "adminName": adminName,
            "phoneNum" : phoneNum,
            "adminLoginId": adminLoginId,
            "adminLoginPw": adminLoginPw,
            "createdAt" : now
        }

        const serverinfo = {
            "company": company,
            "position": position,
            "adminName": adminName,
            "phoneNum" : phoneNum,
            "adminLoginId": adminLoginId,
            "adminLoginPw": adminLoginPw,
            "createdAt" : now
        }


        setserverData = serverData.push(info);
        setData = Data.push(serverinfo);
        onClose();

    }

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
                        <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦소속</FormLabel>
                        <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handlecompany}/>
                    </div>
                    </FormControl>
                    <FormControl mt={4} style={{width: '40%'}}>
                    <div style={{display: "flex"}}>
                        <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦직책</FormLabel>
                        <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleposition}/>
                    </div>
                    </FormControl>
                </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦성명</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleadminName}/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦전화번호</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handlephoneNum}/>
                </div>
                </FormControl>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "3%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦ID</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleadminLoginId}/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦PW</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleadminLoginPw}/>
                </div>
                </FormControl>
            </div>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦 관리도어 선택</FormLabel>
                <Select placeholder='' width="100%">
                    <option value='공과대학'>공과대학</option>
                    <option value='이과대학'>이과대학</option>
                    <option value='문과대학'>문과대학</option>
                </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter style = {{margin: "auto"}}>
            <Button colorScheme='blue' mr={3} onClick = {addInfo}>
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
                            <li><Link href = "./visitorManagement">출입자 관리</Link></li>
                            <li className = "Select"><Link href = "#">출입 관리자</Link></li>
                            <li><Link href = "./alarmHistory">경보 이력</Link></li>
                            <li><Link href = "./smsHistory">문자발생 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle" style = {{width: "25%",  marginRight: "1%"}}>🟦 출입자 관리</h1>
                            <div className = "MainHeaderBtn" style = {{width: "70%"}}>
                                <Button onClick={onOpen} colorScheme='green' style = {{float: "right"}}>➕</Button>
                                {modal}
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
                                                    <td>{item.company}</td>
                                                    <td>{item.adminName}</td>
                                                    <td>{item.adminLoginId}</td>
                                                    <td>{item.phoneNum}</td>
                                                    <td>{item.createdAt}</td>
                                                    <td>{item.isLogin}</td>
                                                    <td>{item.sms}</td>
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