import GameInfo, { BALL_SIZE } from "./runtime/gameInfo";
let gameInfo = new GameInfo();
let newImage = require("./utilities/newImage");
let ctx = canvas.getContext('2d');

const LIVES_IMG = newImage("images/b_gray.png");

/*----------------------------------------------------------------------------*/

let acc = 0;

export default class Lives {
        constructor() {

        }
        render() {
                for (let i = 0; i < gameInfo.lives - 1; i++) {
                        ctx.drawImage(
                                LIVES_IMG,
                                BALL_SIZE + BALL_SIZE * 1.05 * i,
                                BALL_SIZE,
                                BALL_SIZE,
                                BALL_SIZE
                        );
                }

		if (!gameInfo.loseLive) {
			ctx.drawImage(
				LIVES_IMG,
				BALL_SIZE + BALL_SIZE * 1.05 * (gameInfo.lives - 1),
				BALL_SIZE,
				BALL_SIZE,
				BALL_SIZE
			);
		} else {
			this.fadeOut();
		}
        }
	fadeOut() {

		if(acc > Math.PI / 2){
			acc = Math.PI / 2;
			gameInfo.lives--;
			gameInfo.loseLive = false;
		}

		ctx.save();
		ctx.globalAlpha = 1 - Math.sin(acc);
		ctx.drawImage(
			LIVES_IMG,
			BALL_SIZE + BALL_SIZE * 1.05 * (gameInfo.lives - 1),
			BALL_SIZE,
			BALL_SIZE + Math.sin(acc),
			BALL_SIZE + Math.sin(acc)
		);
		ctx.restore();

		if (gameInfo.loseLive) {
			acc += 0.05;
		} else {
			acc = 0;
		}
		
	}
}