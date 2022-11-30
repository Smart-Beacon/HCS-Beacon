import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Login.module.css";

const URL = 'http://localhost:5000/auth/login';
axios.defaults.withCredentials = true;

function Login() {

    const [ID, setID] = useState("")
    const [PW, setPW] = useState("")

    function loginUser(){       //ID, PW를 입력받고 localStorage에 정보를 넣은 후 메인 홈페이지로 이동시키는 함수
        const body = { ID, PW }
        const request = axios.post(URL, body)
            .then(res => {
                if(res.status === 200){
                    localStorage.setItem('name',JSON.stringify(res.data));
                    window.location.replace('http://localhost:3000/main');
                }else{
                    alert(res.data);
                }
            });
    }

    const onIdHandler = (e) => {    //ID를 입력받는 함수
        setID(e.currentTarget.value)
    }

    const onPwHandler = (e) => {    //PW를 입력받는 함수
        setPW(e.currentTarget.value)
    }

    const onSubmitHandler = (e) => {    //로그인 사인을 보내는 함수
        e.preventDefault();
        loginUser();
    }

    return (
        <>
            <div className={styles.LoginForm}>
                <p className={styles.Banner}>Adminstrator</p>
                <form className={styles.Info} onSubmit={onSubmitHandler}>
                    <div className={styles.InfoInput}>
                        <input type="text" value = {ID} placeholder="Admin ID" onChange={onIdHandler} required/>
                        <input type="password" value = {PW} placeholder="Admin PW" onChange={onPwHandler} required/>
                    </div>
                    <div className={styles.InfoButton}>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;