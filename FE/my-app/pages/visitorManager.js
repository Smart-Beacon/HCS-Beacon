import React, {useState, useEffect, useCallback, useRef} from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import SideBar from "./component/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
import css from "styled-jsx/css";
import {Cookies} from "react-cookie";
import axios from "axios";
import {
    Checkbox,
    Button,
    Select,
    Input,
    FormControl,
    FormLabel,
    Modal,
    ModalOverlay,
    ModalContent,
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
          if (cookies.get("isSuper") === "1") {
              setIsSuper(true);
          } else {
              setIsSuper(false);
          }
      }

    
    const header = ["No.", "소속", "관리자이름", "ID", "전화번호", "등록일자", "로그인 상태", "문자수신"]

    const [Data, setData] = useState([]);
    const [DataClone, setDataClone] = useState([]);
    const [doorInfoData, setDoorInfoData] = useState([]);
    const [doorInfoDataClone, setDoorInfoDataClone] = useState([]);
    const [staDoorData, setStaDoorData] = useState([]);


    const getDoorInfo = async () =>{
        const URL = `${process.env.NEXT_PUBLIC_HOST_ADDR}/super/admins`;
        axios.defaults.withCredentials = true;
        axios.get(URL)
        .then(res => {
            // console.log(res);
            if(res.status === 200){
                setData(res.data);
                setDataClone(res.data);           
            }else{
                alert(res.data);
            }
     });
    }

    const [company, setCompany] = useState("");
    const [adminName, setAdminName] = useState("");
    const [adminLoginId, setAdminLoginId] = useState("");
    const [adminLoginPw, setAdminLoginPw] = useState("");
    const [position , setPosition ] = useState("");
    const [isMonitoring, setIsMonitoring] = useState("");
    
    const [checkedList, setCheckedLists] = useState([]);
    const onCheckedElement = useCallback(
        (checked, list) => {
        const checkedData = {
            "doorId" : list.doorId,
            "staId" : list.staId
        }
        // console.log(checkedData);
         if (checked) {
            setCheckedLists([...checkedList, list]);
          } else {
            setCheckedLists(checkedList.filter((el) => el !== list));
          }
        },
        [checkedList]
      );

    const handlecompany = (e) => setCompany(e.target.value);
    const handleadminName = (e) => setAdminName(e.target.value);
    const handleadminLoginId = (e) => setAdminLoginId(e.target.value);
    const handleadminLoginPw = (e) => setAdminLoginPw(e.target.value);
    const handleposition = (e) => setPosition(e.target.value);
    const handleisMonitoring = (e) => setIsMonitoring(e.target.value);
    
    const addInfo = () => {

        const doorListLen = checkedList.length;
        const doorIdList = checkedList.map((e) => e.doorId);
        const staIdList =  checkedList.map((e) => e.staId);
        const set = new Set(staIdList);
        const staIdArray = [...set];

        const info = {
            "company": company,
            "position": position,
            "adminName": adminName,
            "phoneNum" : num,
            "adminLoginId": adminLoginId,
            "adminLoginPw": adminLoginPw,
            "staId": staIdArray,
            "sms": isMonitoring,
            "doorlist": doorIdList
        }
        if(info.company !== "" && info.position !== "" && info.adminName !== ""
        && info.phoneNum !== "" && info.adminLoginId !== "" 
        && info.adminLoginPw !== "" && doorListLen !== 0 && info.sms !== ""){
            getamdinInfo(info);
            setCheckedLists([]);
            onClose();
        }else{
            alert("빈 칸을 작성해주세요");            
        }
    }

    const force = () => {
        window.location.reload();
    }

    const numClear = () => {
        setNum("");
    }

    const [num, setNum] = useState('');
    const phoneRef = useRef();
    const handlePhone = (e) => {
        const value = phoneRef.current.value.replace(/\D+/g, "");
        const numberLength = 11;
        let result;
        result = "";  
        for (let i = 0; i < value.length && i < numberLength; i++) {
          switch (i) {
            case 3:
              result += "-";
              break;
            case 7:
              result += "-";
              break;
    
            default:
              break;
          }
          result += value[i];
        }
        phoneRef.current.value = result;
        setNum(e.target.value); 
      };

    const handleDoorList = (e) => {
        const selectId = e.target.value;
        if(selectId !== ""){
            const result = doorInfoDataClone.filter(e => selectId === e.staId);
            setDoorInfoData(result);
        }else{
            setDoorInfoData([]);
        }
    }

    const getStaDoorInfo = async () =>{
        const URL = `${process.env.NEXT_PUBLIC_HOST_ADDR}/statement`;
        axios.defaults.withCredentials = true;
        axios.post(URL)
        .then(res => {
            // console.log(res);
            if(res.status === 200){
                setDoorInfoData([]);
                setStaDoorData(res.data.staData);
                setDoorInfoDataClone(res.data.doorData);         
            }else{
            }
     });
     onOpen();
    }

    const getamdinInfo = async (item) =>{
        const URL = `${process.env.NEXT_PUBLIC_HOST_ADDR}/super/admin/register`;
        axios.defaults.withCredentials = true;
        axios.post(URL, item)
        .then(res => {
            // console.log(res);
            if(res.status === 200){   
            }else{
            }
     });
    }

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    let modal = null;
    modal = <Modal
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size = {"6xl"}
      >
        <ModalOverlay />
        <ModalContent style = {{height: "80%"}}>
          <ModalBody pb={6} style = {{width: "80%", margin: "auto", marginTop: "8%"}}>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦소속</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handlecompany} required/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦직책</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleposition} required/>
                </div>
                </FormControl>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                    <div style={{display: "flex"}}>
                        <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦성명</FormLabel>
                        <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleadminName} required/>
                    </div>
                    </FormControl>
                    <FormControl mt={4} style={{width: '40%'}}>
                    <div style={{display: "flex"}}>
                        <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦전화번호</FormLabel>
                        <Input 
                                name="user-num"
                                style = {{borderWidth: "2px", borderColor: "black"}} 
                                value={num} 
                                ref={phoneRef}
                                onChange={handlePhone}
                                type="tel"
                                required
                                />
                    </div>
                    </FormControl>
                </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "3%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦ID</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleadminLoginId} required/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦PW</FormLabel>
                    <Input type = "password" style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleadminLoginPw} required/>
                </div>
                </FormControl>
            </div>
            <FormControl mt={4} style = {{width: '85%', margin: "auto", marginBottom: "3%"}}>
                    <div style={{display: "flex"}}>
                        <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦문자 수신 여부</FormLabel>
                        <RadioGroup defaultValue='2'>
                            <Stack spacing={5} direction='row'>
                                <Radio colorScheme='green' value = "1" onChange = {handleisMonitoring}>
                                Y
                                </Radio>
                                <Radio colorScheme='red' value = "0" onChange = {handleisMonitoring}>
                                N
                                </Radio>
                            </Stack>
                            </RadioGroup>
                    </div>
                </FormControl>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦 관리도어 선택</FormLabel>
              <Select placeholder='-------- 선택하세요 --------' width="100%" onChange = {(e) => {handleDoorList(e)}} style = {{textAlign:"center"
            , marginBottom: "3%"}}>
                                    {staDoorData.map((item) => (
                                        <option value={item.staId} key={item.staId}>
                                        {item.staName}
                                        </option>
                                    ))}
                                </Select>
            </FormControl>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦출입문명</FormLabel>
              {doorInfoData.map((item) => (
                                        <Checkbox value={item.doorId} key={item.doorId} style = {{width: "20%", marginBottom: "1%"}}
                                        onChange={(e) => onCheckedElement(e.target.checked, item)}
                                        defaultChecked={checkedList.includes(item) === true ? true : false}>
                                        {item.doorName}
                                        </Checkbox>
                                    ))}
            </FormControl>
          </ModalBody>

          <ModalFooter style = {{margin: "auto"}}>
            <Button colorScheme='blue' mr={3} onClick = {addInfo}>
              저장
            </Button>
            <Button onClick={(e) => {
                onClose(e)
                numClear(e)}} colorScheme='blue'>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    return(
        <div>
            <Header/>
            <div className="container">
                <div className="containerBody">
                    <SideBar pageNumber = "5" isSuper = {isSuper}/>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle" style = {{width: "25%",  marginRight: "1%"}}>🟦 출입자 관리</h1>
                            <div className = "MainHeaderBtn" style = {{width: "75%", display: "flex", justifyContent: "flex-end"}}>
                                <Button onClick = {force} style = {{marginRight: "2%", backgroundColor: "#ffb300"}}>
                                    <FontAwesomeIcon icon={faArrowRotateBack}/>
                                </Button>
                                <Button onClick={getStaDoorInfo} colorScheme='green'>➕</Button>
                                {modal}
                            </div>
                        </div>
                        <div className = "TableThead">
                            <table>
                                <thead>
                                    <tr>{header.map((item, index)=>{
                                        return <th key = {index}>{item}</th>
                                    })}</tr>
                                </thead>
                            </table>
                        </div>
                        <div className = "TableTbody">
                            <table>
                                <tbody>
                                {Data.map((item, index)=>{
                                    const IsLogin = Number(item.isLogin);
                                    let IsLoginValue = "";
                                    const IsSms = Number(item.sms);
                                    let IsSmsValue = "";
                                    if(IsLogin === 1){
                                        IsLoginValue = "Y";
                                    }else{
                                        IsLoginValue = "N";
                                    }
                                    if(IsSms === 1){
                                        IsSmsValue = "Y";
                                    }else{
                                        IsSmsValue = "N";
                                    }
                                            return(
                                                <tr key = {index}>
                                                    <td>{index+1}</td>
                                                    <td>{item.company}</td>
                                                    <td>{item.adminName}</td>
                                                    <td>{item.adminLoginId}</td>
                                                    <td>{item.phoneNum}</td>
                                                    <td>{item.createdAt}</td>
                                                    <td>{IsLoginValue}</td>
                                                    <td>{IsSmsValue}</td>
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