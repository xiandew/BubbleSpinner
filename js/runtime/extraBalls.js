import GameInfo, {
        BALL_SIZE
} from "./gameInfo";
import Ball from "../ball";

let gameInfo = new GameInfo();
let randomBall = require("../utilities/randomBall");
let isCollideSpiral = require("../utilities/isCollideSpiral");

/*----------------------------------------------------------------------------*/

const LINEAR_SPEED = 10;

export default class ExtraBalls {
        constructor() {
                this.balls = [];
        }
        generate() {
                let num = 2 + Math.round(Math.random() * 6);
                let coords = [];
                for (let i = 0, angle, x, y; i < num; i++) {
                        angle = Math.random() * Math.PI * 2;
                        x = Math.cos(angle) * canvas.height;
                        y = Math.sin(angle) * canvas.height;

                        if (x < -BALL_SIZE) {
                                x = -BALL_SIZE;
                        } else if (x > canvas.width + BALL_SIZE) {
                                x = canvas.width + BALL_SIZE;
                        }

                        if (y < -BALL_SIZE) {
                                y = -BALL_SIZE;
                        } else if (y > canvas.height + BALL_SIZE) {
                                y = canvas.height + BALL_SIZE;
                        }
                        coords.push({
                                x: x,
                                y: y
                        });
                }

                this.balls = [];

                coords.forEach(coord => {
                        let ball = new Ball(coord, randomBall());
                        this.balls.push(ball);
                });
        }

        update(spiral) {
                if (gameInfo.lives) {
                        return;
                }

                if (this.balls.length == 0) {
                        this.generate();
                }

                for (let i = this.balls.length - 1, ball, angle; i >= 0; i--) {
                        ball = this.balls[i];

                        if (!ball.speedX || !ball.speedY) {
                                angle = Math.atan2(
                                        gameInfo.holes[0].y - ball.y,
                                        gameInfo.holes[0].x - ball.x
                                );
                                ball.speedX = LINEAR_SPEED * Math.cos(angle);
                                ball.speedY = LINEAR_SPEED * Math.sin(angle);
                        }
                        ball.x += ball.speedX;
                        ball.y += ball.speedY;

                        if (isCollideSpiral(ball)) {
                                spiral.onCollision(ball);
                                this.balls.splice(i, 1);
                        }
                }

                if (this.balls.length == 0) {
                        gameInfo.renewLives();
                }
        }

        render() {
                if (gameInfo.lives || !this.balls) {
                        return;
                }

                this.balls.forEach(ball => {
                        ball.render();
                });
        }
}