import './js/libs/weapp-adapter';
import './js/libs/symbol';

import Main from './js/main';
import {
        BALLS_IMG,
        BALLS_CVS,
        BALL_SIZE
} from './js/runtime/gameInfo';

let loadedBalls = 0;
BALLS_IMG.forEach(ballImg => {
        ballImg.onload = function() {
                let ballCvs = wx.createCanvas();
                let ballCtx = ballCvs.getContext('2d');
                ballCvs.width = ballCvs.height = BALL_SIZE;
                ballCtx.fillStyle = 'rgba(255, 255, 255, 0)';
                ballCtx.drawImage(ballImg, 0, 0, BALL_SIZE, BALL_SIZE);

                BALLS_CVS[ballImg.src] = ballCvs;
                loadedBalls++;
                if (loadedBalls == BALLS_IMG.length) {
                        new Main();
                }
        }
});