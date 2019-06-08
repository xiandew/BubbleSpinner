import Ball from './ball';

const PIVOT_SRC = 'images/pivot.png';

let newImage = require('./utilities/newImage');
let ctx = canvas.getContext('2d');

export default class Pivot extends Ball {
        constructor(hole = {}) {
                super(hole);
		
		this.img = newImage(PIVOT_SRC);
                this.width = this.size;
                this.height = Math.sqrt((this.size / 2) ** 2 - (this.size / 4) ** 2) * 2;
        }

        render() {
                ctx.drawImage(
                        this.img,
                        this.getX() - this.width / 2,
                        this.getY() - this.height / 2,
                        this.width,
                        this.height
                );
        }
}