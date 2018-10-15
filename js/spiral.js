import Ball, {BALL_SIZE} from './ball'

export default class Spiral {
        constructor(layer) {
                this.setupBalls(layer)
        }

        setupBalls(layer) {
                this.balls = []
                let centX = canvas.width / 2
                let centY = canvas.height / 2
                let initX = centX - BALL_SIZE * (layer + 1) / 2
                let initY = centY - BALL_SIZE * (layer + 1)

                for (let y = initY; y < centY; y += BALL_SIZE) {
                        for (var x = initX - (y - initY) / Math.sqrt(3),
                                 xRightEnd = canvas.width - x,
                                 xSeparation = BALL_SIZE / Math.sqrt(3) * 2;
				 x < xRightEnd;
				 x += xSeparation) {
                                this.balls.push(new Ball(x, y))
                        }
                }

                // x offset of the next row
                let xOffset = canvas.width - xRightEnd + BALL_SIZE / Math.sqrt(3)

                for (let y = centY; y < canvas.height - initY - BALL_SIZE; y += BALL_SIZE) {
                        for (var x = xOffset + (y - centY) / Math.sqrt(3),
                                 xRightEnd = canvas.width - x;
				 x < xRightEnd;
				 x += xSeparation) {
                                this.balls.push(new Ball(x, y))
                        }
                }

        }

        update() {

        }

        render(ctx) {
                this.balls.forEach((ball) => {
                        ball.draw(ctx)
                })
        }



}