import './src/libs/weapp-adapter';

import Main from './src/main';
import GameInfo, {
        BALLS_SRC,
        BALLS_CVS
} from './src/runtime/gameInfo';

let gameInfo = GameInfo.getInstance();
let newImage = require('./src/utilities/newImage');

let pixelRatio = gameInfo.pixelRatio;
let ballSize = gameInfo.getBallSize();

BALLS_SRC.forEach(ballSrc => {
        let ballImg = newImage(ballSrc);
        ballImg.onload = function() {
                let ballCvs = wx.createCanvas();
                let ballCtx = ballCvs.getContext('2d');
                ballCvs.width = ballCvs.height = ballSize * pixelRatio;
                ballCtx.fillStyle = 'rgba(255, 255, 255, 0)';
                ballCtx.scale(pixelRatio, pixelRatio);
                ballCtx.drawImage(ballImg, 0, 0, ballSize, ballSize);

                BALLS_CVS[ballSrc] = ballCvs;
                if (Object.keys(BALLS_CVS).length == BALLS_SRC.length) {
                        new Main();
                }
        }
});