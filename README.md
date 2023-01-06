![README logo](https://user-images.githubusercontent.com/32566767/201516950-1ba2ce35-2be3-4840-bc2f-ff436d4a3602.png)

> Development of access management system for major facilities using smart phone and beacon sensor (BLE)  

## 📅 Development Period
2022.08.08. ~ 2022.10.27. (About 3 month)

## 👉 Contributor

<div align="center">
    <a href="https://github.com/ash-hun" align="center">
      <img src=https://img.shields.io/badge/Ash_hun-000000?style=flat-square/>
    </a>
    <a href="https://github.com/MinsungKimDev" align="center">
      <img src=https://img.shields.io/badge/MinsungKimDev-7b00bd?style=flat-square/>
    </a>
    <a href="https://github.com/HS980924" align="center">
      <img src=https://img.shields.io/badge/HS980924-5e5858?style=flat-square/>
    </a>
    <a href="https://github.com/Dejong1706" align="center">
      <img src=https://img.shields.io/badge/Dejong1706-473c99?style=flat-square/>
    </a>
    <a href="https://github.com/Bluewak" align="center">
      <img src=https://img.shields.io/badge/BlueWak-6fafe3?style=flat-square/>
    </a>
</div>

<!---

## 📑 Docs

**[👉 Project Docs! (Don't link Not yet) ]()**


<a href="">
  <img src="https://img.shields.io/badge/Docs-F7DF1E.svg?&style=for-the-badge&logo=Notion&logoColor=000000"/>
</a>
--->
  
---  


     Copyright 2022. Hannam University, SMART BeaconTeam(HCS-Beacon Contributor) All of source cannot be copied without permission.

## 👉  How to use

### FE
1. **$ cd .\FE\my-app** (my-app폴더까지 이동)

2. **$ npm i** (필요한 파일 설치)

3. make ".env" file (my-app폴더에 .env파일 생성& 환경 변수 삽입)

4. **$ npm next build** (배포 및 설치)

5. **$ npm start** (실행)
---  

### HW
1. 라즈베리파이에 node.js 설치
   - Install **node.js** on Raspberry Pi

2. 라즈베리파이에는 HW 폴더만 다운로드 합니다.
   - Download only HW folder to Raspberry Pi

3. 다운로드한 폴더 경로(/'다운로드한 경로'/HW)에서 터미널을 엽니다.
   - Open terminal in downloaded folder path

4. **npm i** 명령어를 입력하면 필요한 패키지를 자동으로 설치합니다.
   - Input **$ npm i** command line in terminal 

5. client.js 파일 앞부분 주석을 확인하여 .env 파일을 생성하여 작성합니다.
  - Check comment Client.js file 앞부분을 and Make .env file edit

6. 서버가 작동되어있는 상태에서 다운로드한 폴더 경로(/'다운로드한 경로'/HW)에서 **sudo node client.js** 명령어를 입력하면 프로그램이 실행됩니다.
  - When the server is executing, type the commend **sudo node client.js** into the terminal.
---  

### BE
1. **$ cd BE** (BE 폴더까지 이동)

2. **$ npm i** (필요한 파일 설치)

3. make ".env" file (BE폴더에 .env파일 생성& 환경 변수 삽입)

4. Start mariaDB (mariaDB 실행)

5. **$ npm run start** (서버 실행)

### <span style="color:red">**Please Check**</span>
- <span style="color:red"> Please Turn on mariaDB before server start!</span>
---  


