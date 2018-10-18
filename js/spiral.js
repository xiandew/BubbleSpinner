import Ball from './ball'
import Pivot from './pivot'

// adjust the ball size according to the screen width.
// diameterSpiral = 0.75 * screenWidth with layer = 5.5
export let ballSize = 0.75 * canvas.width / (1 + 5.5 * 4 / Math.sqrt(3))

export default class Spiral {
        constructor(layers) {
                this.setupBalls(layers)
                //this.setupBalls(Math.floor(0.5 * canvas.width / ballSize))
                // this.hasShownUp = false
        }

        setupBalls(layers) {


                this.balls = []
                let xOffset = ballSize / Math.sqrt(3)
                // Make sure the distance between the centers of two adjacent rows equals to ballSize
                let separation = ballSize / Math.sqrt(3) * 2

                this.pivot = new Pivot(canvas.width / 2, canvas.height / 2)
                for (let layer = 1; layer <= layers; layer++) {
                        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 3) {
                                // draw a ball on the diagonal of the hexagon
                                let x = this.pivot.x - Math.cos(angle) * separation * layer
                                let y = this.pivot.y - Math.sin(angle) * separation * layer
                                this.balls.push(new Ball(x, y, ballSize))
                                // balls in between the diagonal
                                for (let n = 1; n < layer; n++) {
                                        this.balls.push(new Ball(
                                                x + Math.cos(angle + Math.PI / 3) * n * separation,
                                                y + Math.sin(angle + Math.PI / 3) * n * separation, ballSize))
                                }
                        }
                }
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

        onCollision() {
                this.balls.forEach(ball => ball.onCollision(this))
        }

}