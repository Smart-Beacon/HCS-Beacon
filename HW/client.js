/*
*   client.js
*   라즈베리 실행시 24시간 가동되는 (IP주소, 비콘ID)
*/

'use strict';
require('dotenv').config();

const io = require('socket.io-client');
const Gpio = require('onoff').Gpio;

const doorPin = new Gpio(21, 'out');
const OPEN  = 1;
const CLOSE = 0;
let TIME;

const addr = process.env.IP_ADDR || 'http://203.247.40.115:5000';
const beaconId = process.env.BEACON_ID || "01";

const socket = io.connect(addr, {
    path: '/socket.io',
    transports: ['websocket']
});

/*
*   서버와 최초 연결시 비콘ID 발신
*/
socket.emit('set', { beaconId: beaconId });

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