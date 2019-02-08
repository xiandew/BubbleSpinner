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
                this.renderScore();
                super.render();
        }

        renderScore() {
                if (
                        this.dropping == undefined ||
                        this.getY() <= gameInfo.canvasHeight - 5 * this.size
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

                if (this.acc >= Math.PI / 2) {
                        this.acc = Math.PI / 2;

                        gameInfo.removeBall(this);
                        gameInfo.score += gameInfo.getEachWorth();
                }

                if (this.dropping) {
                        this.acc += 0.035;
                }
        }

        initDropping(shooter) {
                this.hole.filled = false;
                let hole = this.hole;
                this.hole = null;
                this.setX(hole.x);
                this.setY(hole.y);

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

        // draw a circle shape instead of image. Not display well on the phone
        /*
	render(ctx) {
		ctx.beginPath()
                ctx.fillStyle = this.colour
                ctx.arc(this.getX(), this.getY(), this.size / 2, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()

                ctx.beginPath()
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
                ctx.arc(this.getX() - this.size / 6, this.getY() + this.size / 6, this.size / 6, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()
        }
	*/
}