import GameInfo, {
        BALLS_CVS
} from './runtime/gameInfo';

let newImage = require('./utilities/newImage');
let ctx = canvas.getContext('2d');

let ballSize = GameInfo.getInstance().getBallSize();

// Abstract class for the ball and the shooter
export default class Sprite {
        constructor(x = 0, y = 0) {
                this.imgSrc = "";
                this.x = x;
                this.y = y;
                this.size = ballSize;
                this.visible = true;
        }

        // cannot use 'onload' method for drawing image during 'reuireAnimationFrame'
        render() {
                if (!this.visible) {
                        return;
                }

                // draw the image from the center at (x, y)
                ctx.drawImage(
                        BALLS_CVS[this.imgSrc],
                        this.getX() - this.size / 2,
                        this.getY() - this.size / 2,
                        this.size,
                        this.size
                );
        }

        getX() {
                return this.x;
        }

        getY() {
                return this.y;
        }

        setX(x) {
                this.x = x;
        }

        setY(y) {
                this.y = y;
	}

        isCollideWith(other) {
                let otherLeft = other.getX() - other.size / 2;
                let otherRight = other.getX() + other.size / 2;
                let otherTop = other.getY() - other.size / 2;
                let otherBottom = other.getY() + other.size / 2;

                return otherLeft < this.getX() + this.size / 2 &&
                        otherRight > this.getX() - this.size / 2 &&
                        otherTop < this.getY() + this.size / 2 &&
                        otherBottom > this.getY() - this.size / 2;
        }
}