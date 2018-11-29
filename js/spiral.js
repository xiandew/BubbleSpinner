import GameInfo, {
        BALL_SIZE
} from './runtime/gameInfo';
import Pivot from './pivot';
import Hole from './hole';
import Ball from './ball';
import Shooter, {
        LINEAR_SPEED
} from './shooter';

let gameInfo = new GameInfo();
let ctx = canvas.getContext('2d');

const FRICTION = -0.001;
const PIVOT_X = 0.5 * canvas.width;
const PIVOT_Y = 0.5 * canvas.height;

/*----------------------------------------------------------------------------*/

// Contains logic for performing actions on the spiral.
export default class Spiral {
        constructor() {
                this.initSpiral();
                this.initBalls();
        }

        initSpiral() {
                this.toChange = true;
                let maxLayers = Math.floor(canvas.width / BALL_SIZE);
                this.pivot = new Pivot(new Hole(PIVOT_X, PIVOT_Y));

                //all holes on the spiral
                gameInfo.holes.push(this.pivot);

                // Make sure the distance between the centers of two adjacent rows equals to BALL_SIZE
                this.separation = BALL_SIZE / Math.sqrt(3) * 2;

                for (let layer = 1; layer <= maxLayers; layer++) {
                        for (let diagonal = 0; diagonal < 6; diagonal++) {
                                // draw a ball on the diagonal of the hexagon
                                let angle = Math.PI / 3 * diagonal;
                                let x = this.pivot.x - Math.cos(angle) * this.separation * layer;
                                let y = this.pivot.y - Math.sin(angle) * this.separation * layer;

                                gameInfo.holes.push(new Hole(x, y, layer));

                                // balls in between the diagonal
                                for (let n = 1; n < layer; n++) {
                                        gameInfo.holes.push(new Hole(
                                                x + Math.cos(angle + Math.PI / 3) * n * this.separation,
                                                y + Math.sin(angle + Math.PI / 3) * n * this.separation, layer));

                                }
                        }
                }
        }

        initBalls() {
                this.rotating = false;

                let layers = gameInfo.getLayers();

                gameInfo.holes.forEach((hole, i) => {
                        if (hole.layer <= layers && hole instanceof Hole) {
                                gameInfo.holes.splice(i, 1, new Ball(hole));
                        }
                        if (hole.layer > layers && !(hole instanceof Hole)) {
                                gameInfo.holes.splice(i, 1, new Hole(hole.x, hole.y, hole.layer));
                        }
                });
        }

        update() {
                if (!this.toChange && this.rotating) {
                        this.rotate();
                }
        }

        render() {
                gameInfo.holes.forEach(hole => {
                        !(hole instanceof Hole) ? hole.render(): true;
                });
        }

        rotate() {
                // add friction
                this.angleSpeed += this.friction;

                if (this.angleSpeed < 0 && this.friction < 0 || this.angleSpeed > 0 && this.friction > 0) {
                        this.rotating = false;
                }
                gameInfo.holes.forEach(hole => hole.rotate(this.angleSpeed));
        }

        onCollision(shooter) {
                // adjust the shooter ball's position to align with the hexagon properly
                // then remove balls which have the same colour and connections to it
                this.fillClosestHole(shooter);

                if (shooter instanceof Shooter) {
                        this.removeSameBalls();
                        this.romoveFloatBalls();
                }

                this.rotating = true;

                // y = kx + m, x = (y - m) / k
                let k = shooter.speedY / shooter.speedX;
                let m = this.target.y - k * this.target.x;

                // the tangent speed is proportional to the distance between the pivot and the linear speed line
                let px = (this.pivot.y - m) / k;
                let py = k * this.pivot.x + m;

                let d = Math.abs((px - this.pivot.x) * (py - this.pivot.y)) /
                        Math.sqrt((py - this.pivot.y) ** 2 + (px - this.pivot.x) ** 2);
                let ratio = d / canvas.width;
                let tangentSpeed = LINEAR_SPEED * ratio;
                this.friction = FRICTION;

                if (shooter.speedX < 0 && (k * this.pivot.x + m) > this.pivot.y ||
                        shooter.speedX > 0 && (k * this.pivot.x + m) < this.pivot.y) {
                        tangentSpeed *= (-1);
                        this.friction *= (-1);
                }

                let nballs = 0;
                gameInfo.holes.forEach(hole => {
                        hole instanceof Ball && hole != this.pivot ? nballs++ : true
                });

                if (nballs > 0) {
                        this.angleSpeed = tangentSpeed / nballs;
                        Math.abs(this.angleSpeed) > 0.1 ? (this.angleSpeed = this.angleSpeed > 0 ? 0.1 : -0.1) : true;
                } else {
                        gameInfo.level++;
                        gameInfo.levelup = true;
                }

                if (shooter instanceof Shooter) {
                        shooter.initShooter();

                        for (let i = gameInfo.holes.length - 1, ball; i >= 0; i--) {
                                ball = gameInfo.holes[i];
                                if (ball instanceof Ball && ball.dropping === false) {
                                        gameInfo.holes.splice(i, 1);
                                }
                        }
                }
        }

        fillClosestHole(shooter) {
                let minSquare = canvas.width ** 2;
                let closest;
                gameInfo.holes.forEach(hole => {
                        if (hole instanceof Hole) {
                                // square of the distance
                                let square = (shooter.x - hole.x) ** 2 + (shooter.y - hole.y) ** 2;
                                square <= minSquare ? (closest = hole, minSquare = square) : true;
                        }
                });

                this.target = new Ball(closest, shooter.img.src);
                gameInfo.holes.splice(gameInfo.holes.indexOf(closest), 1, this.target);
        }

        removeSameBalls() {
                this.sameBalls = [];
                this.findSameBalls(this.target);

                if (this.sameBalls.length >= 3) {
                        this.sameBalls.forEach(ball => {
                                ball.initDropping(this.target);


                                gameInfo.holes.push(new Hole(ball.x, ball.y, ball.layer));
                                gameInfo.score += (gameInfo.level + 1);
                        });
                } else {
                        gameInfo.loseLive = true;
                }
        }

        findSameBalls(target) {
                this.findAround(target).forEach(ball => {
                        if (ball.img.src == target.img.src && !this.sameBalls.includes(ball)) {
                                ball.visited = true;

                                this.sameBalls.push(ball);
                                this.findSameBalls(ball);
                        }
                });
        }

        findAround(target) {
                // balls next to the target
                let around = [];
                gameInfo.holes.forEach(hole => {
                        if (!(hole instanceof Hole)) {
                                let dSquare = Math.floor((hole.x - target.x) ** 2 + (hole.y - target.y) ** 2);
                                if (!hole.visited && hole !== target && dSquare <= this.separation ** 2) {
                                        around.push(hole);
                                }
                        }
                });
                return around;
        }

        romoveFloatBalls() {
                this.revertVisited();

                // visit balls that attached to the pivot
                this.visitAttachedBalls(this.pivot);

                // find balls not attached to the pivot
                gameInfo.holes.forEach(ball => {
                        if ((ball instanceof Ball) && ball != this.pivot && !ball.visited) {
                                ball.initDropping(this.target);

                                gameInfo.holes.push(new Hole(ball.x, ball.y, ball.layer));
                                gameInfo.score += (gameInfo.level + 1);
                        }
                });

                this.revertVisited();
        }

        visitAttachedBalls(target) {
                this.findAround(target).forEach(ball => {
                        ball.visited = true;
                        this.visitAttachedBalls(ball);
                });
        }

        // Ensure every visible balls are not visited
        revertVisited() {
                gameInfo.holes.forEach(ball => {
                        ball instanceof Ball ? ball.visited = false : true;
                });
        }
}