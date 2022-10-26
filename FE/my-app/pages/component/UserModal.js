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
      const [num, setNum] = useState("");

      const addInfo = () => {
        const info = {
            "userName": userName,
            "phoneNum": num
        }
        console.log(info);
        getUserInfo(info);
        onClose();
      }

      const handleUserName = (e) => setUserName(e.target.value);

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

      
      const getUserInfo = async (item) =>{  
        const URL = 'http://localhost:8080/sms/send';
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