import GameInfo, {
        BALL_SIZE,
        SHOOTER_SPEED
} from './runtime/gameInfo';
import Sprite from './sprite';
import Hole from './hole';

/*----------------------------------------------------------------------------*/

import IMPACT_BLACK_JSON from '../fonts/impact_black';
import BitmapFont from "./utilities/bitmapFont";
import BitmapText from "./utilities/bitmapText";
let impact_black = new BitmapFont();
let fontLoaded = false;
let txt;
impact_black.loadFont(IMPACT_BLACK_JSON, function() {
        fontLoaded = true;
        txt = new BitmapText(impact_black);
});

/*----------------------------------------------------------------------------*/

let gameInfo = new GameInfo();
let ctx = canvas.getContext('2d');
let optimalBall = require("./utilities/optimalBall");
let newImage = require('./utilities/newImage');

/*----------------------------------------------------------------------------*/

/**
 * Concrete Ball class. Extends Sprite. Repsents one ball on the spiral.
 */
export default class Ball extends Sprite {
        constructor() {
                super();
                this.visited = false;
                this.acc = 0;
        }

        init(hole = {}, ballSrc = false) {
                this.img.src = !ballSrc ? optimalBall() : ballSrc;
                this.hole = hole;
        }

        rotate(angle) {
                if (this.dropping != undefined) {
                        return;
                }

                let toCentY = this.getY() - gameInfo.canvasHeight / 2;
                let toCentX = this.getX() - gameInfo.canvasWidth / 2;

                let radius = Math.sqrt(toCentX ** 2 + toCentY ** 2);
                this.setX(
                        gameInfo.canvasWidth / 2 +
                        Math.cos(Math.atan2(toCentY, toCentX) - angle) * radius
                );
                this.setX(
                        gameInfo.canvasHeight / 2 +
                        Math.sin(Math.atan2(toCentY, toCentX) - angle) * radius
                );

                if (
                        (this.getX() + this.width / 2) >= gameInfo.canvasWidth ||
                        (this.getY() + this.height / 2) >= gameInfo.canvasHeight ||
                        (this.getX() - this.width / 2) <= 0 ||
                        (this.getY() - this.height / 2) <= 0
                ) {
                        return true;
                }
        }

        render() {
                if (this.dropping) {

                        this.speedX *= 0.998;
                        this.speedY += 0.98;

                        this.setY(this.getY() + this.speedY);
                        this.setX(this.getX() + this.speedX);
                }
                this.renderScore();
                super.render();
        }

        renderScore() {
                if (
                        this.dropping == undefined ||
                        this.getY() <= gameInfo.canvasHeight - 5 * this.width
                ) {
                        return;
                }

                if (!this.scoreX || !this.scoreY) {
                        this.scoreX =
                                this.getX() <=
                                BALL_SIZE ?
                                BALL_SIZE :
                                this.getX() >=
                                gameInfo.canvasWidth - BALL_SIZE ?
                                gameInfo.canvasWidth - BALL_SIZE :
                                this.getX();
                        this.scoreY = this.getY();
                }

                if (this.acc >= Math.PI / 2) {
                        this.acc = Math.PI / 2;
                        this.dropping = false;

                        gameInfo.removeBall(this);
                        gameInfo.score += gameInfo.getEachWorth();
                }

                ctx.save();
                ctx.globalAlpha = 1 - Math.sin(this.acc);
                if (fontLoaded) {
                        txt.fontSize = 0.065 * gameInfo.canvasWidth;
                        txt.textAlign = "center";
                        txt.draw(
                                ctx,
                                `+${gameInfo.getEachWorth()}`,
                                this.scoreX,
                                this.scoreY - Math.sin(this.acc) * 30
                        );
                }
                ctx.restore();

                if (this.dropping) {
                        this.acc += 0.035;
                }
        }

        initDropping(shooter) {
                this.hole = null;

                this.dropping = true;

                // angle between the horizontal and velocity
                let va = Math.atan2(shooter.speedY, shooter.speedX);
                // angle between the horizontal and the joint line from the ball to shooter
                let ha = Math.atan2(this.getY() - shooter.y, this.getX() - shooter.x);
                // difference between two angles
                let da = va - ha;

                let theSpeed = SHOOTER_SPEED * Math.cos(da) / 2;

                this.speedX = theSpeed * Math.cos(ha);
                this.speedY = theSpeed * Math.sin(ha);
        }

        //draw a circle shape instead of image. Not display well on the phone
        /*
	render(ctx) {
                if (!this.visible) {
                        return
                }

                ctx.beginPath()
                ctx.fillStyle = this.colour
                ctx.arc(this.getX(), this.getY(), this.width / 2, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()

                ctx.beginPath()
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
                ctx.arc(this.getX() - this.width / 6, this.getY() + this.width / 6, this.width / 6, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()
        }
	*/
}