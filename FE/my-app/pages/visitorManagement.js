import React, {useState, useEffect, useCallback, useRef } from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import SideBar from "./component/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
import css from "styled-jsx/css";
import axios from "axios";
import { Cookies } from "react-cookie";
import {
    Accordion,
    Box,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Button,
    Checkbox,
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
    Divider,
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
        border-bottom: solid 2px gray;
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
        width: 14.2%;
    }

    table tr td{
        width: 15.25%;
    }

    .TableThead{
        border-bottom: solid 2px gray;
        margin-bottom: 1%;
    }

    .TableTbody{
        height: 85%;
        overflow: auto;
        text-align: center;
    }

    .TableTbody table tr{
        height: 50px;
    }
`;

const cookies = new Cookies();

function useVisitorManagement(){

     useEffect(() => {
        getInfo();
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

    
    const header = ["구분", "성명", "전화번호", "직장명", "직책", "방문일시", "상세정보"]


    const [Data, setData] = useState([]);
    const [DataClone, setDataClone] = useState([]);

    const [doorInfoData, setDoorInfoData] = useState([]);
    const [doorInfoDataClone, setDoorInfoDataClone] = useState([]);
    const [userName, setUserName] = useState("");
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [userLoginId, setUserLoginId] = useState("");
    const [userLoginPw, setUserLoginPw] = useState("");
    const [guestName, setGuestName] = useState("");
    const [staDoorData, setStaDoorData] = useState([]);

    const [isUserFlag, setIsUserFlag] = useState(2);

    const handleUserName = (e) => setUserName(e.target.value);
    const handleCompany = (e) => setCompany(e.target.value);
    const handlePosition = (e) => setPosition(e.target.value);
    const handleUserLoginId = (e) => setUserLoginId(e.target.value);
    const handleUserLoginPw = (e) => setUserLoginPw(e.target.value);
    const handleGuestName = (e) => setGuestName(e.target.value);

    const handleisFlag = (e) => setIsUserFlag(Number(e.target.value));  

    const SearchName = () => {
        if(guestName !== ""){
            const search = DataClone.filter(e => e.userName === guestName);
            setData(search);
        }else{
            setData(DataClone);
        }
    }

    const force = () => {
        window.location.reload();
    }

    const addInfo = () => {

        const doorListLen = checkedList.length;
        // console.log(doorListLen);

        const info = {
            "userName": userName,
            "company": company,
            "position": position,
            "phoneNum": num,
            "userLoginId" : userLoginId,
            "userLoginPw": userLoginPw,
            "userFlag": isUserFlag,
            "doorList": checkedList
        }
        if(info.company !== "" && info.position !== "" && info.adminName !== ""
        && info.num !== "" && info.userLoginId !== "" && info.userLoginPw !== "" && doorListLen !== 0 && isUserFlag !== 2){
            postInfo(info);
            setIsUserFlag(2);
            setCheckedLists([]);
            onClose();
        }else{
            alert("빈 칸을 작성해주세요");            
        }
    }

    const numClear = () => {
        setNum("");
    }

    const handleDoorList = (e) => {
        const selectId = e.target.value;
        if(selectId !== ""){
            const result = doorInfoDataClone.filter(e => selectId === e.staId);
            setDoorInfoData(result);
        }else{
            setDoorInfoData([]);
        }
    }


    const [checkedList, setCheckedLists] = useState([]);
    const onCheckedElement = useCallback(
        (checked, list) => {
         if (checked) {
            setCheckedLists([...checkedList, list]);
          } else {
            setCheckedLists(checkedList.filter((el) => el !== list));
          }
        },
        [checkedList]
      );

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

    const getInfo = async () =>{
        const URL = `${process.env.NEXT_PUBLIC_HOST_ADDR}/user/enterant`;
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

    const postInfo = async (item) =>{
        const URL = `${process.env.NEXT_PUBLIC_HOST_ADDR}/user/enterant`;
        axios.defaults.withCredentials = true;
            await axios.post(URL, item)
            .then(res => {
                if(res.status === 201){
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
                        <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦성명</FormLabel>
                        <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleUserName} required/>
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
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦직장명</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleCompany} required/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦직책</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handlePosition} required/>
                </div>
                </FormControl>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "3%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦ID</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleUserLoginId} required/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦PW</FormLabel>
                    <Input type = "password" style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleUserLoginPw} required/>
                </div>
                </FormControl>
            </div>
            <FormControl mt={4} style = {{width: '85%', margin: "auto", marginBottom: "3%"}}>
              <div style={{display: "flex"}}>
                <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦출입자</FormLabel>
                <RadioGroup defaultValue='2'>
                    <Stack spacing={5} direction='row'>
                        <Radio colorScheme='green' value = "0" onChange = {handleisFlag}>
                        상시 출입자
                        </Radio>
                        <Radio colorScheme='red' value = "1" onChange = {handleisFlag}>
                        자주 출입자
                        </Radio>
                    </Stack>
                    </RadioGroup>
              </div>
            </FormControl>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦건물명</FormLabel>
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
                                        <Checkbox value={item.staId} key={item.doorId} style = {{width: "20%", marginBottom: "1%"}}
                                        onChange={(e) => onCheckedElement(e.target.checked, item.doorId)}
                                        defaultChecked={checkedList.includes(item.doorId) === true ? true : false}>
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
                    <SideBar pageNumber = "4" isSuper = {isSuper}/>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle" style = {{width: "25%",  marginRight: "1%"}}>🟦 출입자 관리</h1>
                            <Input placeholder= "Search Guest Name" style = {{width: "25%"}} onChange = {handleGuestName}/>
                            <Button style = {{marginLeft: "1%"}} onClick = {SearchName}>검색</Button>
                            <div className = "MainHeaderBtn" style = {{width: "50%", display: "flex", justifyContent: "flex-end"}}>
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
                                    let Flag = "";
                                    if(item.userFlag === 0){
                                        Flag = "상시";
                                    } else if(item.userFlag === 1){
                                        Flag = "자주";
                                    } else{
                                        Flag = "방문";
                                    }
                                    let DoorInfo = item.doorInfo;
                                            return(
                                                <tr key = {index}>
                                                    <Accordion allowToggle>
                                                    <AccordionItem>
                                                    <td>{Flag}</td>
                                                    <td>{item.userName}</td>
                                                    <td>{item.phoneNum}</td>
                                                    <td>{item.company}</td>
                                                    <td>{item.position}</td>
                                                    <td>방문일시</td>
                                                    <td>
                                                        <AccordionButton style = {{marginLeft: "52%"}}>
                                                            상세 정보
                                                            <AccordionIcon />
                                                        </AccordionButton></td>
                                                        <AccordionPanel pb={4}>
                                                            {DoorInfo.map((e, index) => {
                                                                return(
                                                                <table key = {index}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>건물명 : {e.staName}</td>
                                                                            <td>도어명 : {e.doorNameList.toString()}</td> 
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                )
                                                            })}
                                                         </AccordionPanel>
                                                        </AccordionItem>
                                                        </Accordion>
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

export default useVisitorManagement;