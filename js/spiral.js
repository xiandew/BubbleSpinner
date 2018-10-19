import Ball, {BALLSIZE} from './ball'
import Pivot from './pivot'
import Shooter from './shooter'

export default class Spiral {
        constructor(layers) {
                this.initSpiral(layers)
        }

        initSpiral(layers) {
                this.pivot = new Pivot(canvas.width / 2, canvas.height / 2)

                let maxLayers = Math.floor(canvas.width / BALLSIZE)

                //contains both invisible and visible balls
                this.balls = []
                // Make sure the distance between the centers of two adjacent rows equals to BALLSIZE
                this.separation = BALLSIZE / Math.sqrt(3) * 2
                for (let layer = 1; layer <= maxLayers; layer++) {
                        for (let diagonal = 0; diagonal < 6; diagonal++) {
                                // draw a ball on the diagonal of the hexagon
                                let angle = Math.PI / 3 * diagonal
                                let x = this.pivot.x - Math.cos(angle) * this.separation * layer
                                let y = this.pivot.y - Math.sin(angle) * this.separation * layer
                                let visible = false
                                if (layer <= layers) {
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
		this.balls.forEach(ball => ball.slideOutScreen(this.newBall))
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
		this.sameColours = []

		this.newBall = this.closestPosition(shooter)
		this.findSameColours(this.newBall)
		this.eraseSameColours()
		this.revertVisitied()
		this.eraseFloatBalls()

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
                        closest.colour = shooter.colour

                        shooter.initShooter()
                } else {
                        //
                }
                return closest
        }
	
	findSameColours(target){
		let balls = []
		this.findAround(target).forEach(ball => {
			if (ball.colour === target.colour) {
				balls.push(ball)
			}
		})
		while (balls.length != 0) {
			let ball = balls.pop()
			ball.visited = true
			this.sameColours.push(ball)
			this.findSameColours(ball)
		}
	}

        findAround(target) {
		// balls next to the target
                let balls = []
                this.balls.forEach(ball => {
			if (ball.visible && !ball.visited && ball !== target &&
				Math.floor((ball.x - target.x) ** 2 + (ball.y - target.y) ** 2) <= this.separation ** 2) {
                                balls.push(ball)
                        }
                })
                return balls
        }

	eraseSameColours(){
		if (this.sameColours.length >= 3) {
			this.sameColours.forEach(ball => {
				ball.visible = false
			})
		}
	}

	eraseFloatBalls(){
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
	revertVisitied(){
		this.balls.forEach(ball => {
			if (ball.visible) {
				ball.visited = false
			}
		})
	}
}