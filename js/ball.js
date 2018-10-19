import Sprite, {SHAPE} from './sprite'

export const COLOURS = ['#1da2da', '#014765', '#01986a', '#d392ba', '#b14701', '#ecd613']

// adjust the ball size according to the screen width.
// diameterSpiral = 0.75 * screenWidth with layer = 5.5
// where 5.5 is a magic number which I think gives the best view on the screen
export const BALLSIZE = 0.75 * canvas.width / (1 + 5.5 * 4 / Math.sqrt(3))

export default class Ball extends Sprite {
        constructor(x, y, layer, visible) {
		super(COLOURS[Math.floor(Math.random() * COLOURS.length)], BALLSIZE, BALLSIZE, x, y, visible, [SHAPE])

                // record the layer of the ball to compute its neighbours
                this.layer = layer
		this.visited = false
        }

        // render a circle shape
        render(ctx) {
                if (!this.visible) {
                        return
                }

                ctx.beginPath()
                ctx.fillStyle = this.colour
                ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()

                ctx.beginPath()
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
                ctx.arc(this.x - this.width / 6, this.y + this.width / 6, this.width / 6, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()
        }

        update() {

        }
}