/*
*   led.js
*
*   라즈베리 동작 테스트용 코드
*   LED가 0.5초 간격으로 점멸됩니다.
*
*   사용법 - *현재 디렉토리에서* sudo node led.js
*/

'use strict';

const Gpio = require('onoff').Gpio;
const LED = new Gpio(21, 'out');

const HIGH = 1;
const LOW  = 0;

const blinkInterval = setInterval(blinkLED, 500);

function blinkLED() {
    if(LED.readSync() === LOW) {
        LED.writeSync(HIGH);
    } else {
        LED.writeSync(LOW);
    }
}