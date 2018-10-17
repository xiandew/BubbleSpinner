import Sprite, {SHAPE} from './sprite'

const COLOURS = ['#1da2da', '#014765', '#01986a', '#d392ba', '#b14701', '#ecd613']

export default class Ball extends Sprite {
        constructor(x, y, size) {
		super(COLOURS[Math.floor(Math.random() * COLOURS.length)], size, size, x, y, [SHAPE])
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

	update(){

	}

	onCollision(spiral){
		//console.log(spiral)
	}
}