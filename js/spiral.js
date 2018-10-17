import Ball from './ball'
import Pivot from './pivot'

export let ballSize
export default class Spiral {
        constructor(layer) {
                this.setupBalls(layer)
		// this.hasShownUp = false
        }

        setupBalls(layer) {
		// adjust the ball size according to the screen width.
		// diameterSpiral = 0.75 * screenWidth with layer = 5.5
		ballSize = 0.75 * canvas.width / (1 + 5.5 * 4 / Math.sqrt(3))
		
                this.balls = []

                let xOffset = ballSize / Math.sqrt(3)
                let xSeparation = ballSize / Math.sqrt(3) * 2

                let initX = canvas.width / 2 - ballSize * (layer + 1) / 2
                let initY = canvas.height / 2 - ballSize * (layer + 1)

                for (let row = 0; row <= layer; row++) {
                        for (let col = 0; col <= layer + row; col++) {
                                this.balls.push(new Ball(
                                        initX - row * xOffset + col * xSeparation,
                                        initY + row * ballSize, ballSize))
                        }
                }

                initX = initX - (layer - 1) * xOffset
                initY = initY + (layer + 1) * ballSize

                for (let row = layer; row > 0; row--) {
                        for (let col = 0; col < layer + row; col++) {
                                this.balls.push(new Ball(
                                        initX + (layer - row) * xOffset + col * xSeparation,
                                        initY + (layer - row) * ballSize, ballSize))
                        }
                }
		this.pivot = new Pivot(this.balls[Math.floor(this.balls.length / 2)])
		this.balls.splice(Math.floor(this.balls.length / 2), 1)
        }

        update() {
		
        }

	render(ctx) {
		/* TODO a show up animation
		if (!this.hasShownUp) {
			this.showup()
			this.hasShownUp = true
		}*/

		this.pivot.render(ctx)
                this.balls.forEach((ball) => {
			ball.render(ctx)
                })
	}

	onCollision(){
		this.balls.forEach(ball => ball.onCollision(this))
	}

}