import React, { useState, useRef } from 'react';
import {
    Input,
    FormControl,
    FormLabel,
  } from '@chakra-ui/react'


const Phone = () => {
  const [num, setNum] = useState('');
  const phoneRef = useRef();

  // 휴대폰 번호 입력 함수
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

  return (
        <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
            <div style={{display: "flex"}}>
                <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦성명</FormLabel>
                <Input 
                name="user-num"
                style = {{borderWidth: "2px", borderColor: "black"}} 
                value={num} 
                ref={phoneRef}
                onChange={handlePhone}
                type="tel"
                />
                </div>
            </FormControl>
  );
};

export default Phone;