import GameInfo from "../runtime/gameInfo";
let gameInfo = GameInfo.getInstance();
let newImage = require("../utilities/newImage");
let ctx = canvas.getContext('2d');

const LIVES_IMG = newImage("images/b_gray.png");

/*----------------------------------------------------------------------------*/

let ballSize = gameInfo.getBallSize();
let acc = 0;
let delta;

export default class Lives {
        constructor() {

        }
        render() {
                if (!gameInfo.lives) {
                        return;
                }

                for (let i = 0; i < gameInfo.lives - 1; i++) {
                        ctx.drawImage(
                                LIVES_IMG,
                                ballSize + ballSize * 1.05 * i,
                                ballSize,
                                ballSize,
                                ballSize
                        );
                }

                if (!gameInfo.loseLive) {
                        ctx.drawImage(
                                LIVES_IMG,
                                ballSize + ballSize * 1.05 * (gameInfo.lives - 1),
                                ballSize,
                                ballSize,
                                ballSize
                        );
                } else {
                        this.fadeOut();
                }
        }

        fadeOut() {

                if (acc >= Math.PI / 2) {
                        acc = Math.PI / 2;
                        gameInfo.lives--;
                        gameInfo.loseLive = false;
                }

                delta = ballSize + Math.sin(acc) * 5;

                ctx.save();
                ctx.globalAlpha = 1 - Math.sin(acc);
                ctx.drawImage(
                        LIVES_IMG,
                        ballSize * 1.05 * gameInfo.lives - 0.5 * (delta - ballSize),
                        ballSize - 0.5 * (delta - ballSize),
                        delta,
                        delta
                );
                ctx.restore();

                if (gameInfo.loseLive) {
                        acc += 0.1;
                } else {
                        acc = 0;
                }
        }
}