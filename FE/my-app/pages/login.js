import React from "react";
import styles from "../styles/Login.module.css";

function Login() {
    return (
        <>
            <div className={styles.LoginForm}>
                <p className={styles.Banner}>Adminstrator</p>
                <div className={styles.Info}>
                    <div className={styles.InfoInput}>
                        <input type="text" placeholder="Admin ID" />
                        <input type="text" placeholder="Admin PW" />
                    </div>
                    <div className={styles.InfoButton}>
                        <button>Login</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;