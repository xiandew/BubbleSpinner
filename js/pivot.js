import Sprite, {SHAPE} from './sprite'

export default class Pivot extends Sprite {
        constructor(ball){
		super('', ball.width, ball.height, ball.x, ball.y, [SHAPE])
        }

	render(ctx){
		// a hexagon pivot
		let vertices = 6, length = this.width / 2
		let getDegree = function (vertices, i) { return 360 / vertices * (i + 0.5) + 90 }
		let getRadian = function (degree) { return degree * Math.PI / 180 }

		ctx.beginPath()
		for (let i = 0; i <= vertices; i++) {
			let degree = getDegree(vertices, i), radian = getRadian(degree)
			let x = Math.cos(radian) * length + this.x
			let y = Math.sin(radian) * length + this.y
			ctx.lineTo(x, y)
		}
		
		ctx.fillStyle = '#888888'
		ctx.fill()
		ctx.strokeStyle = '#000000'
		ctx.stroke()
		ctx.closePath()
	}

}