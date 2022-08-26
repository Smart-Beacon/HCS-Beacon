import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Login.module.css";

const URL = 'http://localhost:5000/auth/login';
axios.defaults.withCredentials = true;

function Login() {

    const [ID, setID] = useState("")
    const [PW, setPW] = useState("")

    function loginUser(){
        const body = { ID, PW }
        const request = axios.post(URL, body)
            .then(res => {
                console.log(res);
                if(res.status === 200){
                    console.log("======================", "로그인 성공");
                    window.location.assign('http://localhost:3000/main');
                }else{
                    alert(res.data);
                }
            });
    }

    const onIdHandler = (e) => {
        console.log(ID);
        setID(e.currentTarget.value)
    }

    const onPwHandler = (e) => {
        console.log(PW);
        setPW(e.currentTarget.value)
    }

    const onSubmitHandler = (e) => {
        console.log('start');
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