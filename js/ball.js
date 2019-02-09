import GameInfo, {
        BALL_SIZE,
        SHOOTER_SPEED
} from './runtime/gameInfo';
import Sprite from './sprite';
import Hole from './hole';

/*----------------------------------------------------------------------------*/

let optimalBall = require('./utilities/optimalBall');
let newImage = require('./utilities/newImage');
let renderPlusScore = require('./utilities/renderPlusScore');

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
                renderPlusScore(this);
                super.render();
        }
}