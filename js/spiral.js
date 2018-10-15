import Ball, {BALL_SIZE} from './ball'

export default class Spiral{
        constructor(layer){
		this.setupBalls(layer)
        }

        setupBalls(layer){
                this.balls = []

		let centY = canvas.height / 2
                let initY = centY - BALL_SIZE * layer
		let centX = canvas.width / 2
                let initX = centX - BALL_SIZE * layer / 2

		let side = BALL_SIZE * (layer + 1)

		for (let y = initY; y < centY; y += BALL_SIZE) {
			for (let
				x = initX - (y - initY) / 2;
				x < initX + (y - initY) / 2 + side;
				x += BALL_SIZE + 2) {
				this.balls.push(new Ball(x, y))
			}
		}
		for (let y = centY; y < centY + initY - BALL_SIZE; y += BALL_SIZE) {
			for (let
				x = centX - side + BALL_SIZE + (y - centY) / 2;
				x < centX + side - (y - centY) / 2;
				x += BALL_SIZE + 2) {
				this.balls.push(new Ball(x, y))
			}
		}

        }

	render(ctx){

		ctx.clearRect(0, 0, canvas.width, canvas.height)
		this.balls.forEach((ball) => { ball.render(ctx) })
	}



}