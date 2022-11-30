import React, {useState, useRef} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useDisclosure,
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
    ModalCloseButton, } from '@chakra-ui/react'

function UserModal() {

      const [userName, setUserName] = useState(""); 
      const [num, setNum] = useState(""); //핸드폰 번호를 담아두는 useState
      const phoneRef = useRef();
      
      const handleUserName = (e) => setUserName(e.target.value); //userName을 입력할 때 마다 값을 저장하는 useState

      const addInfo = () => {       //입력한 userName과 PhoneNumber를 info에 저장 후 서버로 보내는 함수
        const info = {
            "userName": userName,
            "phoneNum": num
        }
        getUserInfo(info);
        onClose();
      }

      const handlePhone = (e) => {        //핸드폰 번호를 입력할 때 숫자만 입력받고 3 4 4순서로 자동 -을 넣어주는 함수
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

      
      const getUserInfo = async (item) =>{  
        const URL = `${process.env.NEXT_PUBLIC_HOST_ADDR}/sms/send`;
        axios.defaults.withCredentials = true;
        await axios.post(URL, item)
        .then(res => {
            // console.log(res);
            if(res.status === 202){
                console.log("데이터 전송 성공");   
            }else{
                console.log("데이터 전송 실패");
            }
    });
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
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>성명</FormLabel>
            <Input ref={initialRef} placeholder='성명' onChange={handleUserName}/>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>전화번호</FormLabel>
            <Input 
                name="user-num"
                style = {{borderWidth: "2px", borderColor: "black"}} 
                value={num} 
                ref={phoneRef}
                onChange={handlePhone}
                type="tel"
                required
                                />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick = {addInfo}>
            전송
          </Button>
          <Button onClick={onClose}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  return (
    <div>
        <div onClick={onOpen} style = {{position: "absolute", right: "50px", bottom: "50px" , fontSize: "50px",
                                            color: "#ffecb3"}}><FontAwesomeIcon icon={faPaperPlane}/>
        {modal}
        </div>
    </div>
  );
}

export default UserModal;