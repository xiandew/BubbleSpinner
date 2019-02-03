import GameInfo, {
        BALL_SIZE,
        SHOOTER_SPEED
} from './runtime/gameInfo';
import Pivot from './pivot';
import Hole from './hole';
import Ball from './ball';
import Shooter from './shooter';

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
                let maxLayers = Math.floor(Math.max(gameInfo.canvasWidth, gameInfo.canvasHeight / 2) / BALL_SIZE);

                this.toChange = true;
                gameInfo.pivot = new Pivot(new Hole(PIVOT_X, PIVOT_Y));

                //all holes on the spiral
                gameInfo.holes.push(gameInfo.pivot);

                for (let layer = 1; layer <= maxLayers; layer++) {
                        for (let diagonal = 0; diagonal < 6; diagonal++) {
                                // draw a ball on the diagonal of the hexagon
                                let angle = Math.PI / 3 * diagonal;
                                let x = gameInfo.pivot.x - Math.cos(angle) * separation * layer;
                                let y = gameInfo.pivot.y - Math.sin(angle) * separation * layer;

                                gameInfo.holes.push(new Hole(x, y, layer));

                                // balls in between the diagonal
                                for (let n = 1; n < layer; n++) {
                                        gameInfo.holes.push(new Hole(
                                                x + Math.cos(angle + Math.PI / 3) * n * separation,
                                                y + Math.sin(angle + Math.PI / 3) * n * separation, layer));
                                }
                        }
                }
        }

        initBalls() {
                this.rotating = false;
                this.collideBorder = false;

                let layers = gameInfo.getLayers();

                // clear the spiral for optimising the distribution of the spiral
                gameInfo.holes.forEach((hole, i) => {
                        if (hole != gameInfo.pivot && hole instanceof Ball) {
                                gameInfo.holes.splice(i, 1, new Hole(hole.x, hole.y, hole.layer));
                        }
                });

                gameInfo.holes.forEach((hole, i) => {
                        if (hole != gameInfo.pivot && hole.layer <= layers) {
                                gameInfo.holes.splice(i, 1, new Ball(hole));
                        }
                });
        }

        update() {
                if (this.toChange) {
                        return;
                }

                deleteOffScreenBalls();
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

                gameInfo.holes.forEach(hole => {
                        if (!(hole instanceof Hole)) {
                                hole.render();
                        }
                });
        }

        rotate() {
                // add friction
                this.angleSpeed += this.friction;

                if (this.angleSpeed < 0 && this.friction < 0 ||
                        this.angleSpeed > 0 && this.friction > 0) {

                        this.rotating = false;
                }

                for (let i = 0, hole; i < gameInfo.holes.length; i++) {
                        hole = gameInfo.holes[i];
                        !this.collideBorder ? this.collideBorder = hole.rotate(this.angleSpeed) : true;
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
                let m = this.target.y - k * this.target.x;

                // the tangent speed is proportional to the distance between
                // the pivot and the linear speed line
                let px = (gameInfo.pivot.y - m) / k;
                let py = k * gameInfo.pivot.x + m;

                let d = Math.abs((px - gameInfo.pivot.x) * (py - gameInfo.pivot.y)) /
                        Math.sqrt((py - gameInfo.pivot.y) ** 2 + (px - gameInfo.pivot.x) ** 2);
                let ratio = d / gameInfo.canvasWidth;
                let tangentSpeed = SHOOTER_SPEED * ratio;
                this.friction = FRICTION;

                if (other.speedX < 0 && (k * gameInfo.pivot.x + m) > gameInfo.pivot.y ||
                        other.speedX > 0 && (k * gameInfo.pivot.x + m) < gameInfo.pivot.y) {
                        tangentSpeed *= (-1);
                        this.friction *= (-1);
                }

                // count attached balls
                let nballs = 0;
                gameInfo.holes.forEach(hole => {
                        if (hole instanceof Ball &&
                                hole != gameInfo.pivot &&
                                hole.dropping == undefined) {

                                nballs++;
                        }
                });

                this.angleSpeed = tangentSpeed;
                if (nballs > 0) {
                        this.angleSpeed /= nballs;

                        if (Math.abs(this.angleSpeed) > 0.1) {
                                this.angleSpeed = this.angleSpeed > 0 ? 0.1 : -0.1;
                        }
                }

                other.initShooter();
        }

        fillClosestHole(target) {
                let minSquare = gameInfo.canvasWidth ** 2;
                let closest, index;
                gameInfo.holes.forEach((hole, i) => {
                        if (hole instanceof Hole &&
                                Math.abs(target.x - hole.x) < separation * 2 &&
                                Math.abs(target.y - hole.y) < separation * 2) {

                                // square of the distance
                                let square = (target.x - hole.x) ** 2 + (target.y - hole.y) ** 2;
                                if (square <= minSquare) {
                                        [closest, index] = [hole, i];
                                        minSquare = square;
                                }
                        }
                });

                this.target = new Ball(closest, target.img.src);
                gameInfo.holes.splice(index, 1, this.target);
        }

        findSameBalls(target) {
                findAround(target).forEach(ball => {

                        if (ball.img.src == target.img.src && !this.sameBalls.includes(ball)) {
                                ball.visited = true;

                                this.sameBalls.push(ball);
                                this.findSameBalls(ball);
                        }
                });
        }

        removeSameBalls() {
                this.sameBalls = [];
                this.findSameBalls(this.target);

                if (this.sameBalls.length >= 3) {
                        this.sameBalls.forEach(ball => {
                                ball.initDropping(this.shooter);
                        });
                } else {
                        gameInfo.loseLive = true;
                }
        }

        romoveFloatBalls() {
                revertVisited();

                // visit balls that attached to the pivot
                visitAttachedBalls(gameInfo.pivot);

                // find balls not attached to the pivot
                gameInfo.holes.forEach(ball => {
                        if (ball instanceof Ball && ball != gameInfo.pivot &&
                                !ball.visited && ball.dropping == undefined) {

                                ball.initDropping(this.shooter);
                        }
                });

                revertVisited();
        }
}

function findAround(target) {
        // balls next to the target
        let around = [];

        gameInfo.holes.forEach(hole => {
                if (!(hole instanceof Hole)) {
                        let dSquare = Math.floor(
                                (hole.x - target.x) ** 2 +
                                (hole.y - target.y) ** 2
                        );
                        if (!hole.visited && hole !== target && dSquare <= separation ** 2) {
                                around.push(hole);
                        }
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
        gameInfo.holes.forEach(ball => {
                if (ball instanceof Ball) {
                        ball.visited = false;
                }
        });
}

function deleteOffScreenBalls() {
        for (let i = gameInfo.holes.length - 1, ball; i >= 0; i--) {
                ball = gameInfo.holes[i];
                if (ball instanceof Ball && ball.dropping == false) {
                        gameInfo.holes.splice(i, 1);
                }
        }
}

function countOnScreenBalls() {
        let nballs = 0;
        gameInfo.holes.forEach(ball => {
                if (ball instanceof Ball && ball != gameInfo.pivot) {
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