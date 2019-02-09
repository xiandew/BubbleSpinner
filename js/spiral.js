import GameInfo, {
        BALL_SIZE,
        SHOOTER_SPEED
} from './runtime/gameInfo';
import Pivot from './pivot';
import Hole from './hole';
import Ball from './ball';
import Shooter from './shooter';

let rotate = require('./utilities/rotate');
let initDropping = require('./utilities/initDropping');

let gameInfo = new GameInfo();
let ctx = canvas.getContext('2d');

/*----------------------------------------------------------------------------*/

// FRICTION = -0.001 when screenWidth = 320 and pixelRatio = 2
const FRICTION = -canvas.width / 640000;
const PIVOT_X = 0.5 * gameInfo.canvasWidth;
const PIVOT_Y = 0.5 * gameInfo.canvasHeight;

/*----------------------------------------------------------------------------*/

// Make sure the distance between the centers of two adjacent rows equals to BALL_SIZE
let separation = BALL_SIZE / Math.sqrt(3) * 2;

// Contains logic for performing actions on the spiral.
export default class Spiral {
        constructor() {
                this.initSpiral();
                this.initBalls();
        }

        initSpiral() {
                this.toChange = true;
                gameInfo.pivot = new Pivot(new Hole(PIVOT_X, PIVOT_Y));

                // all balls on the spiral
                gameInfo.balls.push(gameInfo.pivot);

                // all holes of the spiral
                let maxLayers = Math.floor(Math.max(gameInfo.canvasWidth, gameInfo.canvasHeight / 2) / BALL_SIZE);
                for (let layer = 1; layer <= maxLayers; layer++) {
                        for (let diagonal = 0; diagonal < 6; diagonal++) {
                                // draw a ball on the diagonal of the hexagon
                                let angle = Math.PI / 3 * diagonal;
                                let x = PIVOT_X - Math.cos(angle) * separation * layer;
                                let y = PIVOT_Y - Math.sin(angle) * separation * layer;

                                gameInfo.holes.push(new Hole(x, y, layer));

                                // balls in between the diagonal
                                for (let n = 1; n < layer; n++) {
                                        gameInfo.holes.push(
                                                new Hole(
                                                        x + Math.cos(angle + Math.PI / 3) * n * separation,
                                                        y + Math.sin(angle + Math.PI / 3) * n * separation,
                                                        layer
                                                )
                                        );
                                }
                        }
                }
        }

        initBalls() {
                this.rotating = false;
                this.collideBorder = false;

                for (let i = gameInfo.balls.length - 1, ball; i >= 0; i--) {
                        if (gameInfo.balls[i]) {
                                ball = gameInfo.balls[i];
                                if (ball != gameInfo.pivot) {
                                        gameInfo.removeBall(ball);
                                }
                        }
                }

                let layers = gameInfo.getLayers();
                gameInfo.holes.forEach(hole => {
                        if (hole != gameInfo.pivot && hole.layer <= layers) {
                                gameInfo.balls.push(newBall(hole));
                        }
                });
        }

        update() {
                if (this.toChange) {
                        return;
                }

                if (countOnScreenBalls() == 0) {
                        this.toChange = true;

                        gameInfo.levelup = true;
                        gameInfo.level++;
                }

                if (this.rotating) {
                        if (this.collideBorder) {
                                if (countDroppingBalls() == 0) {
                                        gameInfo.over = true;
                                }
                        } else {
                                this.rotate();
                        }
                }
        }

        render() {
                gameInfo.balls.forEach(ball => {
                        ball ? ball.render() : true;
                });
        }

        rotate() {
                // add friction
                this.angleSpeed += this.friction;

                if (
                        this.angleSpeed < 0 && this.friction < 0 ||
                        this.angleSpeed > 0 && this.friction > 0
                ) {
                        this.rotating = false;
                }

                for (let i = 0, hole; i < gameInfo.holes.length; i++) {
                        hole = gameInfo.holes[i];
                        if (!this.collideBorder) {
                                this.collideBorder = rotate(hole, this.angleSpeed);
                        } else {
                                break;
                        }
                }
        }

        onCollision(other) {
                // adjust the other ball's position to align with the hexagon properly
                this.fillClosestHole(other);

                if (!(other instanceof Shooter)) {
                        return;
                }

                this.shooter = other;

                this.removeSameBalls();
                this.romoveFloatBalls();

                this.rotating = true;

                // y = kx + m, x = (y - m) / k
                let k = other.speedY / other.speedX;
                let m = this.target.getY() - k * this.target.getX();

                // the tangent speed is proportional to the distance between
                // the pivot and the linear speed line
                let px = (PIVOT_Y - m) / k;
                let py = k * PIVOT_X + m;

                let d = Math.abs((px - PIVOT_X) * (py - PIVOT_Y)) /
                        Math.sqrt((py - PIVOT_Y) ** 2 + (px - PIVOT_X) ** 2);
                let ratio = d / gameInfo.canvasWidth;
                let tangentSpeed = SHOOTER_SPEED * ratio;
                this.friction = FRICTION;

                if (
                        other.speedX < 0 && (k * PIVOT_X + m) > PIVOT_Y ||
                        other.speedX > 0 && (k * PIVOT_X + m) < PIVOT_Y
                ) {
                        tangentSpeed *= (-1);
                        this.friction *= (-1);
                }

                // count attached balls, not on screen balls
                let nballs = 0;
                gameInfo.balls.forEach(ball => {
                        if (
                                ball != gameInfo.pivot &&
                                ball.dropping == undefined
                        ) {
                                nballs++;
                        }
                });

                this.angleSpeed = tangentSpeed;
                if (nballs > 0) {
                        this.angleSpeed /= nballs;
                        if (Math.abs(this.angleSpeed) > 0.1) {
                                this.angleSpeed = this.angleSpeed > 0 ? 0.1 : -0.1;
                        }
                } else {
                        this.rotating = false;
                }

                other.initShooter();
        }

        fillClosestHole(target) {
                let minSquare = gameInfo.canvasWidth ** 2;
                let closest;
                gameInfo.holes.forEach(hole => {
                        if (
                                hole.filled == false &&
                                hole.layer <= gameInfo.outerLayer &&
                                Math.abs(target.getX() - hole.x) < separation * 2 &&
                                Math.abs(target.getY() - hole.y) < separation * 2
                        ) {
                                // square of the distance
                                let square =
                                        (target.getX() - hole.x) ** 2 +
                                        (target.getY() - hole.y) ** 2;
                                if (square <= minSquare) {
                                        closest = hole;
                                        minSquare = square;
                                }
                        }
                });
                if ((closest.layer + 1) > gameInfo.outerLayer) {
                        gameInfo.outerLayer = closest.layer + 1;
                }
                this.target = newBall(closest, target.img.src);
                gameInfo.balls.push(this.target);
        }

        removeSameBalls() {
                this.sameBalls = [];
                this.findSameBalls(this.target);

                if (this.sameBalls.length >= 3) {
                        this.sameBalls.forEach(ball => {
                                initDropping(ball, this.shooter);
                        });
                } else {
                        gameInfo.loseLive = true;
                }
        }

        findSameBalls(target) {
                findAround(target).forEach(ball => {
                        if (
                                ball.img.src == target.img.src &&
                                !this.sameBalls.includes(ball)
                        ) {
                                ball.visited = true;
                                this.sameBalls.push(ball);
                                this.findSameBalls(ball);
                        }
                });
        }

        romoveFloatBalls() {
                revertVisited();

                // visit balls that attached to the pivot
                visitAttachedBalls(gameInfo.pivot);

                // find balls not attached to the pivot
                gameInfo.balls.forEach(ball => {
                        if (
                                ball != gameInfo.pivot &&
                                ball.visited != true &&
                                ball.dropping == undefined
                        ) {
                                initDropping(ball, this.shooter);
                        }
                });

                revertVisited();
        }
}

function findAround(target) {
        // balls next to the target
        let around = [];

        gameInfo.balls.forEach(ball => {
                let dSquare = Math.floor(
                        (ball.getX() - target.getX()) ** 2 +
                        (ball.getY() - target.getY()) ** 2
                );
                if (
                        ball.visited != true &&
                        ball !== target &&
                        dSquare <= separation ** 2
                ) {
                        around.push(ball);
                }
        });

        return around;
}

function visitAttachedBalls(target) {
        findAround(target).forEach(ball => {
                if (ball.dropping == undefined) {
                        ball.visited = true;
                        visitAttachedBalls(ball);
                }
        });
}

// Ensure every visible balls are not visited
function revertVisited() {
        gameInfo.balls.forEach(ball => {
                ball.visited = false;
        });
}

function countOnScreenBalls() {
        let nballs = 0;
        gameInfo.balls.forEach(ball => {
                if (ball != gameInfo.pivot && ball.visible) {
                        nballs++;
                }
        });
        return nballs;
}

function countDroppingBalls() {
        let nballs = 0;
        gameInfo.holes.forEach(ball => {
                if (ball.dropping != undefined) {
                        nballs++;
                }
        });

        return nballs;
}

function newBall(hole = {}, ballSrc = false) {
        hole.filled = true;

        let ball = gameInfo.pool.getItemByClass('ball', Ball);
        ball.init(hole, ballSrc);

        return ball;
}