import './js/libs/weapp-adapter';
import './js/libs/symbol';

import Main from './js/main';
import {
        BALLS_SRC,
        BALLS_CVS,
        BALL_SIZE,
        PIXEL_RATIO
} from './js/runtime/gameInfo';

let newImage = require('./js/utilities/newImage');

BALLS_SRC.forEach(ballSrc => {
        let ballImg = newImage(ballSrc);
        ballImg.onload = function() {
                let ballCvs = wx.createCanvas();
                let ballCtx = ballCvs.getContext('2d');
                ballCvs.width = ballCvs.height = BALL_SIZE * PIXEL_RATIO;
                ballCtx.fillStyle = 'rgba(255, 255, 255, 0)';
                ballCtx.scale(PIXEL_RATIO, PIXEL_RATIO);
                ballCtx.drawImage(ballImg, 0, 0, BALL_SIZE, BALL_SIZE);

                BALLS_CVS[ballSrc] = ballCvs;
                if (Object.keys(BALLS_CVS).length == BALLS_SRC.length) {
                        new Main();
                }
        }
});