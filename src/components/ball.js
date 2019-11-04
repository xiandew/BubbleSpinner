import GameInfo from '../runtime/gameInfo';
import Sprite from './base/sprite';
import Hole from './hole';
import Shooter from './shooter';

/*----------------------------------------------------------------------------*/

import IMPACT_BLACK_JSON from '../../fonts/impact_black';
import BitmapFont from '../utilities/bitmapFont';
import BitmapText from '../utilities/bitmapText';
let impact_black = new BitmapFont();
let fontLoaded = false;
let txt;
impact_black.loadFont(IMPACT_BLACK_JSON, function() {
        fontLoaded = true;
        txt = new BitmapText(impact_black);
});

/*----------------------------------------------------------------------------*/

let optimalBall = require('../utilities/optimalBall');
let newImage = require('../utilities/newImage');

/*----------------------------------------------------------------------------*/

let ctx = canvas.getContext('2d');
let gameInfo = GameInfo.getInstance();
let shooter = Shooter.getInstance();

let ballSize = gameInfo.getBallSize();
let shooterSpeed = gameInfo.getShooterSpeed();

/*----------------------------------------------------------------------------*/

/**
 * Concrete Ball class. Extends Hole. Repsents one ball on the spiral.
 */
export default class Ball extends Hole {
	constructor(hole = {}, ballSrc = false) {
                super(hole.x, hole.y, hole.layer);
		this.imgSrc = !ballSrc ? optimalBall() : ballSrc;
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
                this.renderPlusScore();
                super.render();
        }

        renderPlusScore() {
                if (this.dropping == undefined ||
                        this.getY() <= gameInfo.canvasHeight - 5 * ballSize) {
                        return;
                }
                if (this.dropping &&
                        this.getY() >= gameInfo.canvasHeight + ballSize) {
                        this.dropping = false;
                }

                if (!this.scoreX || !this.scoreY) {
                        this.scoreX =
                                this.getX() <=
                                ballSize ?
                                ballSize :
                                this.getX() >=
                                gameInfo.canvasWidth - ballSize ?
                                gameInfo.canvasWidth - ballSize :
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

		// delete this instance
                if (this.acc >= Math.PI / 2) {
                        this.acc = Math.PI / 2;

			gameInfo.balls.delete(this);
                        gameInfo.score += gameInfo.getEachWorth();
                }

                if (this.dropping != undefined) {
                        this.acc += 0.035;
                }
        }

        initDropping() {
		gameInfo.holes[gameInfo.holes.indexOf(this)] = new Hole(this.x, this.y, this.layer);
                this.dropping = true;

                // angle between the horizontal and velocity
                let va = Math.atan2(shooter.speedY, shooter.speedX);
                // angle between the horizontal and the joint line from the ball to shooter
                let ha = Math.atan2(this.getY() - shooter.y, this.getX() - shooter.x);
                // difference between two angles
                let da = va - ha;

                let theSpeed = shooterSpeed * Math.cos(da) / 2;

                this.speedX = theSpeed * Math.cos(ha);
                this.speedY = theSpeed * Math.sin(ha);
        }

	rotate(angle) {
		super.rotate(angle);
		if (((this.x + ballSize / 2) >= gameInfo.canvasWidth ||
				(this.y + ballSize / 2) >= gameInfo.canvasHeight ||
				(this.x - ballSize / 2) <= 0 ||
				(this.y - ballSize / 2) <= 0)) {
			return true;
		}
	}
}