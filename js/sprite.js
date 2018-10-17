// avoid typos
export const IMAGE = 'IMAGE'
export const SHAPE = 'SHAPE'

export default class Sprite {
        constructor(imgData = '', width = 0, height = 0, x = 0, y = 0, opts = []) {
                if (opts.includes(IMAGE)) {
                        this.img = new Image()
			this.img.src = imgData
                }
                if (opts.includes(SHAPE)) {
			this.colour = imgData
                }
                this.width = width
                this.height = height
                this.x = x
                this.y = y
                this.visible = true
        }

        // render an image
        render(ctx) {
                if (!this.visible) {
                        return
                }

                // draw the image from the center at (x, y)
                ctx.drawImage(
                        this.img,
                        this.x - this.width / 2,
                        this.y - this.height / 2,
                        this.width,
                        this.height
                )
        }

        isCollideWith(other) {
		/*let otherLeft = other.x - other.width / 2
		let otherRight = other.x + other.width / 2
		let otherTop = other.y - other.height / 2
                let otherBottom = other.y + other.height / 2

		
                if (!this.visible || !other.visible)
                        return false

		return otherLeft < this.x + this.width / 2 &&
			otherRight > this.x - this.width / 2 &&
			otherTop < this.y + this.height / 2 &&
			otherBottom > this.y - this.height /2*/
		
		return (other.x-this.x)**2 + (other.y - this.y)**2 <= this.width**2
        }
}