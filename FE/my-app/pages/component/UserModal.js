import React, {useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
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
            <Input ref={initialRef} placeholder='성명' />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>전화번호</FormLabel>
            <Input placeholder='전화번호' />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3}>
            전송
          </Button>
          <Button onClick={onClose}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  return (
    <div>
        <div onClick={onOpen} style = {{position: "absolute", right: "50px", bottom: "50px" , fontSize: "50px",
                                            color: "#ffecb3"}}><FontAwesomeIcon icon={faMessage}/>
        {modal}
        </div>
    </div>
  );
}

export default UserModal;