import GameInfo, {
        BALLS,
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

                this.ballsCoord = [
                        [-BALL_SIZE, Math.random() * canvas.height * 0.5],
                        [-BALL_SIZE, Math.random() * canvas.height * 0.5 + canvas.height * 0.5],
                        [canvas.width + BALL_SIZE, Math.random() * canvas.height * 0.5],
                        [canvas.width + BALL_SIZE, Math.random() * canvas.height * 0.5 + canvas.height * 0.5],
                        [Math.random() * canvas.width, -BALL_SIZE],
                        [Math.random() * canvas.width, canvas.height + BALL_SIZE]
                ];

                this.balls = [];
                let ballSrc = shuffle(BALLS);

                this.ballsCoord.forEach((coord, i) => {
                        let ball = new Ball();
                        [ball.x, ball.y] = coord;
                        ball.img.src = ballSrc[i];
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

                this.balls.forEach(ball => {
                        if (typeof(ball.speedX) == "undefined" ||
                                typeof(ball.speedY) == "undefined") {
                                let angle = Math.atan2(
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
                                this.balls.splice(this.balls.indexOf(ball), 1);
                                return;
                        }
                });

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

function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
}