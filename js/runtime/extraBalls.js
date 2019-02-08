import GameInfo, {
        BALL_SIZE
} from "./gameInfo";
import Ball from "../ball";

let gameInfo = new GameInfo();
let randomBall = require("../utilities/randomBall");
let isCollideSpiral = require("../utilities/isCollideSpiral");

/*----------------------------------------------------------------------------*/

// LINEAR_SPEED = 10 when gameInfo.canvasWidth = 320
const LINEAR_SPEED = gameInfo.canvasWidth / 32;

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

                        x = x < -BALL_SIZE ?
                                -BALL_SIZE : x >
                                gameInfo.canvasWidth + BALL_SIZE ?
                                gameInfo.canvasWidth + BALL_SIZE : true;
                        y = y < -BALL_SIZE ?
                                -BALL_SIZE : y >
                                gameInfo.canvasHeight + BALL_SIZE ?
                                gameInfo.canvasHeight + BALL_SIZE : true;

                        starts.push([x, y]);
                }

                this.balls = [];
                starts.forEach(coord => {
                        let ball = gameInfo.pool.getItemByClass('ball', Ball);
                        ball.img.src = randomBall();
                        ball.setX(coord[0]);
                        ball.setY(coord[1]);
                        this.balls.push(ball);
                });

                // find optimal destinations
                let arr = [];
                gameInfo.balls.map(ball => {
                        arr.push({
                                k: Math.sqrt(
                                        (ball.getX() - gameInfo.pivot.getX()) ** 2 +
                                        (ball.getY() - gameInfo.pivot.getY()) ** 2),
                                v: ball
                        });
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
                                        dest.y - ball.getY(),
                                        dest.x - ball.getX()
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

                        if (ball.x < -BALL_SIZE || ball.x >= gameInfo.canvasWidth + BALL_SIZE ||
                                ball.y < -BALL_SIZE || ball.y >= gameInfo.canvasHeight + BALL_SIZE) {
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