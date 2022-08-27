import React, { useState, useEffect } from 'react';
import moment from 'moment';
import css from "styled-jsx/css";
import Link from "next/link";

const style = css`
  .container{
    width: 95%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }  

  .MainLogo{
    font-size: 70px;
  }

  .NavBar{
    display: inline-block;
    vertical-align: middle;
  }

  .NavBar ul{
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  .NavBar ul li{
    margin-right: 30px;
  }

  .NavBar ul button{
    margin-right: 30px;
  }
`;

function Header() {
  let timer = null;
  const [time, setTime] = useState(moment());
  useEffect(() => {
    timer = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <div className="container">
        <div className="MainLogo"><Link href = "../main">Logo</Link></div>
        <div className="NavBar">
          <ul>
            <li>
            {time.format('HH:mm')}
            </li>
            <li>{time.format('YYYY-MM-DD(ddd)')}</li>
            <li>박병근님</li>
            <button><Link href = "../login">로그아웃</Link></button>
          </ul>
        </div>
      </div>
      <style jsx>{style}</style>
    </div>
  );
}

export default Header;