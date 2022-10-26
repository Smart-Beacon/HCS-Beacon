/*
*   client.js
*
*   라즈베리 실행시 24시간 가동되는 코드
*   서버의 IP주소, 비콘ID를 .env파일에 작성해주시기 바랍니다.
*
*   작성 예시
*   IP_ADDR="https://xxx.xxx.xxx.xxx:포트번호"
*   BEACON_ID="FF:FF:FF:FF:FF:FF"
*
*   사용법 - *현재 디렉토리에서* sudo node client.js
*/

'use strict';
require('dotenv').config();

const io = require('socket.io-client');
const Gpio = require('onoff').Gpio;

const doorPin = new Gpio(21, 'out');
const OPEN  = 0;
const CLOSE = 1;
let TIME;

const addr     = process.env.IP_ADDR;
const beaconId = process.env.BEACON_ID;

doorPin.writeSync(CLOSE);

const socket = io.connect(addr, {
    path: '/socket.io',
    transports: ['websocket']
});

/*
*   서버와 최초 연결시 비콘ID 발신
*/
socket.emit('set', { beaconId: beaconId });

/*
 *  서버와 재연결시 메시지 발신 
 */
socket.on('againSet', msg => {
    console.log("Server reconnected");
    socket.emit('set', { beaconId: beaconId });
});

/*
*   비상개방 열기 신호 대기
*/
socket.on('emergencyOpen', msg => {
    clearTimeout(TIME);
    doorPin.writeSync(OPEN);
});

/*
*   비상개방 닫기 신호 대기
*/
socket.on('emergencyClose', msg => {
    doorPin.writeSync(CLOSE);
});

/*
*   일반개방 열기 신호 대기
*/
socket.on('open', msg => {
    console.log(msg);

    doorPin.writeSync(OPEN);
    socket.emit('change', { beaconId: beaconId, isOpen: true });

    TIME = setTimeout(_ => {
        doorPin.writeSync(CLOSE);
        socket.emit('change', { beaconId: beaconId, isOpen: false });
    }, msg.duration);
});