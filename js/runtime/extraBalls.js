import GameInfo from "./gameInfo";
import Ball from "../ball";

let gameInfo = GameInfo.getInstance();
let randomBall = require("../utilities/randomBall");
let isCollideSpiral = require("../utilities/isCollideSpiral");

/*----------------------------------------------------------------------------*/

// LINEAR_SPEED = 10 when gameInfo.canvasWidth = 320
const LINEAR_SPEED = gameInfo.canvasWidth / 32;
let ballSize = gameInfo.getBallSize();

export default class ExtraBalls {
        constructor() {
                this.balls = [];
                this.generated = false;
        }
        generate() {
                this.generated = true;

                let num = 2 + Math.round(Math.random() * 6);
                let starts = [];
                for (let i = 0, angle, x, y; i < num; i++) {
                        angle = Math.random() * Math.PI * 2;
                        x = Math.cos(angle) * gameInfo.canvasHeight;
                        y = Math.sin(angle) * gameInfo.canvasHeight;

                        x = x < -ballSize ?
                                -ballSize : x >
                                gameInfo.canvasWidth + ballSize ?
                                gameInfo.canvasWidth + ballSize : x;
                        y = y < -ballSize ?
                                -ballSize : y >
                                gameInfo.canvasHeight + ballSize ?
                                gameInfo.canvasHeight + ballSize : y;

                        starts.push([x, y]);
                }

                this.balls = [];
                starts.forEach(coord => {
                        let ball = new Ball();
                        ball.imgSrc = randomBall();
                        ball.setX(coord[0]);
                        ball.setY(coord[1]);
                        ball.visible = true;
                        this.balls.push(ball);
                });

                // find optimal destinations
                let arr = [];
                gameInfo.balls.forEach(ball => {
                        if (ball.dropping == undefined) {
                                arr.push({
                                        k: Math.sqrt(
                                                (ball.getX() - gameInfo.pivot.getX()) ** 2 +
                                                (ball.getY() - gameInfo.pivot.getY()) ** 2),
                                        v: ball
                                });
                        }
                });
                arr.sort((b1, b2) => {
                        return b2.k - b1.k;
                });

                this.dests = arr
                        .slice(0, Math.ceil(Math.random() * this.balls.length / 2))
                        .map(a => {
                                return a.v;
                        });
        }

        update(spiral) {
                if (gameInfo.lives) {
                        return;
                }

                if (this.balls.length == 0 && !spiral.rotating) {
                        this.generate();
                }

                for (let i = this.balls.length - 1, ball, angle; i >= 0; i--) {
                        ball = this.balls[i];

                        if (!ball.speedX || !ball.speedY) {
                                let dest = this.dests[Math.floor(Math.random() * this.dests.length)];
                                angle = Math.atan2(
                                        dest.getY() - ball.getY(),
                                        dest.getX() - ball.getX()
                                );
                                ball.speedX = LINEAR_SPEED * Math.cos(angle);
                                ball.speedY = LINEAR_SPEED * Math.sin(angle);
                        }
                        ball.setX(ball.getX() + ball.speedX);
                        ball.setY(ball.getY() + ball.speedY);

                        if (isCollideSpiral(ball)) {
                                spiral.onCollision(ball);
                                this.balls.splice(i, 1);
                                continue;
                        }

                        if (
                                ball.x < -ballSize || ball.x >= gameInfo.canvasWidth + ballSize ||
                                ball.y < -ballSize || ball.y >= gameInfo.canvasHeight + ballSize
                        ) {
                                this.balls.splice(i, 1);
                        }
                }

                if (this.balls.length == 0 && this.generated) {
                        gameInfo.renewLives();
                        this.generated = false;
                }
        }

        render() {
                if (gameInfo.lives || !this.balls.length) {
                        return;
                }

                this.balls.forEach(ball => {
                        ball.render();
                });
        }
}