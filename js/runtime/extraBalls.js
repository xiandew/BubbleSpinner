import GameInfo, {
        BALL_SIZE
} from "./gameInfo";
import Ball from "../ball";

let gameInfo = new GameInfo();
let randomBall = require("../utilities/randomBall");
let isCollideSpiral = require("../utilities/isCollideSpiral");

/*----------------------------------------------------------------------------*/

// LINEAR_SPEED = 10 when canvas.width = 320
const LINEAR_SPEED = canvas.width / 32;

export default class ExtraBalls {
        constructor() {
                this.balls = [];
                this.generated = false;
        }
        generate() {
                this.generated = true;

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
                        this.balls.push(new Ball(coord, randomBall()));
                });

                // find optimal destinations
                let arr = [];
                gameInfo.holes.map(ball => {
                        if (ball instanceof Ball) {
                                arr.push({
                                        k: Math.sqrt(
                                                (ball.x - gameInfo.pivot.x) ** 2 +
                                                (ball.y - gameInfo.pivot.y) ** 2),
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
                                        dest.y - ball.y,
                                        dest.x - ball.x
                                );
                                ball.speedX = LINEAR_SPEED * Math.cos(angle);
                                ball.speedY = LINEAR_SPEED * Math.sin(angle);
                        }
                        ball.x += ball.speedX;
                        ball.y += ball.speedY;

                        let c = isCollideSpiral(ball);
                        if (c) {
                                spiral.onCollision(ball, c);
                                this.balls.splice(i, 1);
                                continue;
                        }

                        if (ball.x < -BALL_SIZE || ball.x >= canvas.width + BALL_SIZE ||
                                ball.y < -BALL_SIZE || ball.y >= canvas.height + BALL_SIZE) {
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