import Pivot from './pivot'
import Ball, {BALL_SIZE} from './ball'
import Shooter, {LINEAR_SPEED} from './shooter'

const FRICTION = 0.001
export default class Spiral {
	constructor(layers) {
		this.rotating = false
		this.layers = layers
		this.initSpiral()
	}

	initSpiral() {
		this.pivot = new Pivot(canvas.width / 2, canvas.height / 2)
		let maxLayers = Math.floor(canvas.width / BALL_SIZE)

		//contains both invisible and visible balls
		this.balls = []
		// Make sure the distance between the centers of two adjacent rows equals to BALL_SIZE
		this.separation = BALL_SIZE / Math.sqrt(3) * 2
		for (let layer = 1; layer <= maxLayers; layer++) {
			for (let diagonal = 0; diagonal < 6; diagonal++) {
				// draw a ball on the diagonal of the hexagon
				let angle = Math.PI / 3 * diagonal
				let x = this.pivot.x - Math.cos(angle) * this.separation * layer
				let y = this.pivot.y - Math.sin(angle) * this.separation * layer
				let visible = false
				if (layer <= this.layers) {
					visible = true
				}
				this.balls.push(new Ball(x, y, layer, visible))

				// balls in between the diagonal
				for (let n = 1; n < layer; n++) {
					this.balls.push(new Ball(
						x + Math.cos(angle + Math.PI / 3) * n * this.separation,
						y + Math.sin(angle + Math.PI / 3) * n * this.separation, layer, visible))
				}
			}
		}
	}

	update() {
		//this.balls.forEach(ball => ball.slideOutScreen())
		if (this.rotating) {
			this.rotate()
		}

	}

	render(ctx) {
                /* TODO a show up animation
                if (!this.hasShownUp) {
                	this.showup()
                	this.hasShownUp = true
                }*/

		this.pivot.render(ctx)
		this.balls.forEach(ball => ball.render(ctx))
	}

	onCollision(shooter) {
		// adjust the shooter ball's position to align with the hexagon properly
		// then erase balls which have the same colour and connections to it
		this.sameBalls = []

		this.newBall = this.closestPosition(shooter)

		this.findSameBalls(this.newBall)
		this.eraseSameColours()
		this.revertVisitied()
		this.eraseFloatBalls()

		this.rotating = true

		// y = kx + m
		// x = (y - m) / k
		let k = shooter.speedY / shooter.speedX
		let m = this.newBall.y - k * this.newBall.x

		// the tangent speed is proportional to the distance between
		// the pivot and the linear speed line
		let px = (this.pivot.y - m) / k
		let py = k * this.pivot.x + m
		let d = Math.abs((px - this.pivot.x) * (py - this.pivot.y)) /
			Math.sqrt((py - this.pivot.y) ** 2 + (px - this.pivot.x) ** 2)
		let ratio = d / canvas.width
		let tangentSpeed = LINEAR_SPEED * ratio

		if (shooter.speedX < 0 && (k * this.pivot.x + m) > this.pivot.y ||
			shooter.speedX > 0 && (k * this.pivot.x + m) < this.pivot.y) {
			tangentSpeed *= (-1)
			this.friction = FRICTION
		} else {
			this.friction = -FRICTION
		}

		let nballs = 0
		this.balls.forEach(ball => {
			if (ball.visible) {
				nballs++
			}
		})

		this.angleSpeed = tangentSpeed / nballs
		if (this.angleSpeed > 0.25) {
			this.angleSpeed = 0.25
		}
		if (this.angleSpeed < -0.25) {
			this.angleSpeed = -0.25
		}

		shooter.initShooter()
	}

	closestPosition(shooter) {
		let minSquare = canvas.width ** 2
		let closest
		this.balls.forEach(ball => {
			// square of the distance
			let square = (shooter.x - ball.x) ** 2 + (shooter.y - ball.y) ** 2
			if (!ball.visible && square <= minSquare) {
				minSquare = square
				closest = ball
			}
		})
		if (closest) {
			closest.visible = true
			closest.visited = false
			closest.img.src = shooter.img.src
		} else {
			//
		}
		return closest
	}

	findSameBalls(target) {
		let balls = []
		this.findAround(target).forEach(ball => {
			if (ball.img.src === target.img.src) {
				balls.push(ball)
			}
		})
		while (balls.length != 0) {
			let ball = balls.pop()
			ball.visited = true
			this.sameBalls.push(ball)
			this.findSameBalls(ball)
		}
	}

	findAround(target) {
		// balls next to the target
		let balls = []
		this.balls.forEach(ball => {
			let dSquare = Math.floor((ball.x - target.x) ** 2 + (ball.y - target.y) ** 2)
			if (ball.visible && !ball.visited && ball !== target && dSquare <= this.separation ** 2) {
				balls.push(ball)
			}
		})
		return balls
	}

	eraseSameColours() {
		if (this.sameBalls.length >= 3) {
			this.sameBalls.forEach(ball => {
				ball.visible = false
			})
		}
	}

	eraseFloatBalls() {
		// visit balls that attached to the pivot
		this.visitAttachedBalls(this.pivot)
		// find balls not attached to the pivot
		this.balls.forEach(ball => {
			if (ball.visible && !ball.visited) {
				ball.visible = false
			}
		})
		this.revertVisitied()
	}

	visitAttachedBalls(target) {
		let around = []
		around = this.findAround(target)
		around.forEach(ball => {
			if (ball.visible) {
				ball.visited = true
				this.visitAttachedBalls(ball)
			}
		})
	}
	// Ensure every visible balls are not visited
	revertVisitied() {
		this.balls.forEach(ball => {
			if (ball.visible) {
				ball.visited = false
			}
		})
	}

	rotate() {
		// add friction
		this.angleSpeed += this.friction

		if (this.angleSpeed < 0 && this.friction < 0 || this.angleSpeed > 0 && this.friction > 0) {
			this.rotating = false
		}
		this.balls.forEach(ball => ball.rotate(this.angleSpeed))
	}
}