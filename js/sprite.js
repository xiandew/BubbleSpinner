// avoid typos
export const IMAGE = 'IMAGE'
export const SHAPE = 'SHAPE'
export default class Sprite {
        constructor(imgData = '', width = 0, height = 0, x = 0, y = 0, opts = []) {
                if (opts.indexOf(IMAGE) >= 0) {
                        this.img = new Image()
			this.img.src = imgData
                }
                if (opts.indexOf(SHAPE) >= 0) {
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
        // draw a circle shape
        draw(ctx) {
		if (!this.visible) {
			return
		}

		ctx.beginPath()
		ctx.fillStyle = this.colour
		ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI)
		ctx.fill()
		
		ctx.beginPath()
		ctx.fillStyle = 'rgba(255,255,255,0.5)'
		ctx.arc(this.x - this.width / 6, this.y + this.width / 6, this.width / 6, 0, 2 * Math.PI)
		ctx.fill()
        }

        isCollideWith(sp) {
                let spX = sp.x + sp.width / 2
                let spY = sp.y + sp.height / 2

                if (!this.visible || !sp.visible)
                        return false

                return !!(spX >= this.x &&
                        spX <= this.x + this.width &&
                        spY >= this.y &&
                        spY <= this.y + this.height)
        }
}