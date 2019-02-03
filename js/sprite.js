let ctx = canvas.getContext('2d');
let newImage = require('./utilities/newImage');

// Top level `abstract` class for the game
export default class Sprite {
        constructor(imgSrc = "", width = 0, height = 0, x = 0, y = 0) {
                this.img = newImage(imgSrc);
                this.width = width;
                this.height = height;

                this.x = x;
                this.y = y;

                this.visiable = true;
        }

        // cannot use 'onload' method for drawing image during 'reuireAnimationFrame'
        render() {
                if (!this.visiable) {
                        return;
                }

                // draw the image from the center at (x, y)
                ctx.drawImage(
                        this.img,
                        this.x - this.width / 2,
                        this.y - this.height / 2,
                        this.width,
                        this.height
                );

		// if (this.hole) {
		// 	ctx.drawImage(
		// 		this.img,
		// 		this.hole.x - this.width / 2,
		// 		this.hole.y - this.height / 2,
		// 		this.width,
		// 		this.height
		// 	);
		// }
        }

        isCollideWith(other) {
                let otherLeft = other.x - other.width / 2;
                let otherRight = other.x + other.width / 2;
                let otherTop = other.y - other.height / 2;
                let otherBottom = other.y + other.height / 2;

                return otherLeft < this.x + this.width / 2 &&
                        otherRight > this.x - this.width / 2 &&
                        otherTop < this.y + this.height / 2 &&
                        otherBottom > this.y - this.height / 2;
        }
}