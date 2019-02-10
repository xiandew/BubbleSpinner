import GameInfo, {
        BALL_SIZE,
        SHOOTER_SPEED
} from './runtime/gameInfo';
import Sprite from './sprite';
import Hole from './hole';

/*----------------------------------------------------------------------------*/

import IMPACT_BLACK_JSON from '../fonts/impact_black';
import BitmapFont from './utilities/bitmapFont';
import BitmapText from './utilities/bitmapText';
let impact_black = new BitmapFont();
let fontLoaded = false;
let txt;
impact_black.loadFont(IMPACT_BLACK_JSON, function() {
        fontLoaded = true;
        txt = new BitmapText(impact_black);
});

/*----------------------------------------------------------------------------*/

let optimalBall = require('./utilities/optimalBall');
let newImage = require('./utilities/newImage');

/*----------------------------------------------------------------------------*/

let gameInfo = new GameInfo();
let ctx = canvas.getContext('2d');

/*----------------------------------------------------------------------------*/

/**
 * Concrete Ball class. Extends Sprite. Repsents one ball on the spiral.
 */
export default class Ball extends Sprite {
        constructor() {
                super();
        }

        init(hole = {}, ballSrc = false) {
                this.img.src = !ballSrc ? optimalBall() : ballSrc;
                this.hole = hole;
                this.acc = 0;
                this.visited = false;
                this.visible = true;
        }

        render() {
                if (this.dropping) {
                        this.speedX *= 0.998;
                        this.speedY += 0.98;

                        this.setY(this.getY() + this.speedY);
                        this.setX(this.getX() + this.speedX);
                }
                Ball.renderPlusScore(this);
                super.render();
        }

        static renderPlusScore(ball) {
                if (
                        ball.dropping == undefined ||
                        ball.getY() <= gameInfo.canvasHeight - 5 * ball.size
                ) {
                        return;
                }
                if (
                        ball.dropping &&
                        ball.getY() >= gameInfo.canvasHeight + BALL_SIZE
                ) {
                        ball.dropping = false;
                }

                if (!ball.scoreX || !ball.scoreY) {
                        ball.scoreX =
                                ball.getX() <=
                                BALL_SIZE ?
                                BALL_SIZE :
                                ball.getX() >=
                                gameInfo.canvasWidth - BALL_SIZE ?
                                gameInfo.canvasWidth - BALL_SIZE :
                                ball.getX();
                        ball.scoreY = ball.getY();
                }

                ctx.save();
                ctx.globalAlpha = 1 - Math.sin(ball.acc);
                if (fontLoaded) {
                        txt.fontSize = 0.065 * gameInfo.canvasWidth;
                        txt.textAlign = "center";
                        txt.draw(
                                ctx,
                                `+${gameInfo.getEachWorth()}`,
                                ball.scoreX,
                                ball.scoreY - Math.sin(ball.acc) * 30
                        );
                }
                ctx.restore();

                if (ball.acc >= Math.PI / 2) {
                        ball.acc = Math.PI / 2;

                        gameInfo.removeBall(ball);
                        gameInfo.score += gameInfo.getEachWorth();
                }

                if (ball.dropping != undefined) {
                        ball.acc += 0.035;
                }
        }

        static initDropping(ball, shooter) {
                ball.dropping = true;
                ball.hole.filled = false;

                let hole = ball.hole;
                ball.hole = null;
                ball.setX(hole.x);
                ball.setY(hole.y);

                // angle between the horizontal and velocity
                let va = Math.atan2(shooter.speedY, shooter.speedX);
                // angle between the horizontal and the joint line from the ball to shooter
                let ha = Math.atan2(ball.getY() - shooter.y, ball.getX() - shooter.x);
                // difference between two angles
                let da = va - ha;

                let theSpeed = SHOOTER_SPEED * Math.cos(da) / 2;

                ball.speedX = theSpeed * Math.cos(ha);
                ball.speedY = theSpeed * Math.sin(ha);
        }
}