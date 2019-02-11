import {
        BALL_SIZE
} from './runtime/gameInfo';

let newImage = require('./utilities/newImage');
let ctx = canvas.getContext('2d');

// Abstract class for the ball and the shooter
export default class Sprite {
        constructor(x = 0, y = 0) {
                this.img = newImage("");
                this.x = x;
                this.y = y;
                this.size = BALL_SIZE;
                this.visible = true;
        }

        // cannot use 'onload' method for drawing image during 'reuireAnimationFrame'
        render() {
                if (!this.visible) {
                        return;
                }

                // draw the image from the center at (x, y)
                ctx.drawImage(
                        this.img,
                        this.getX() - this.size / 2,
                        this.getY() - this.size / 2,
                        this.size,
                        this.size
                );
        }

        getX() {
                return this.hole ? this.hole.x : this.x;
        }

        getY() {
                return this.hole ? this.hole.y : this.y;
        }

        setX(x) {
                this.hole ? this.hole.x = x : this.x = x;
        }

        setY(y) {
                this.hole ? this.hole.y = y : this.y = y;
        }

        getLayer() {
                return this.hole.layer;
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