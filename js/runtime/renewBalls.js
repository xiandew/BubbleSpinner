import GameInfo, { BALLS, BALL_SIZE } from "./gameInfo";
import Ball from "../ball";

let gameInfo = new GameInfo();
let randomBall = require("../utilities/randomBall");
let isCollideSpiral = require("../utilities/isCollideSpiral");

export default class RenewBalls {
	constructor() {
		this.renewed = false
	}
	renew() {

		this.ballsCoord = [
			[-BALL_SIZE, Math.random() * canvas.height * 0.5],
			[-BALL_SIZE, Math.random() * canvas.height * 0.5 + canvas.height * 0.5],
			[canvas.width + BALL_SIZE, Math.random() * canvas.height * 0.5],
			[canvas.width + BALL_SIZE, Math.random() * canvas.height * 0.5 + canvas.height * 0.5],
			[Math.random() * canvas.width, -BALL_SIZE],
			[Math.random() * canvas.width, canvas.height + BALL_SIZE]
		];

		this.balls = [];

		this.ballsCoord.forEach(coord => {
			let ball = new Ball();
			[ball.x, ball.y] = coord;
			ball.img.src = randomBall();
			this.balls.push(ball);
		});
	}

	update() {
		if (!gameInfo.lives && !this.renewed) {
			renew();
			this.renewed = true;
		}
	}

	render() {
		this.balls.forEach(ball => {
			ball.render();
		});
	}
}