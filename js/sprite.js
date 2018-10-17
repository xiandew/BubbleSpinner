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