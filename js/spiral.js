import Ball, {
        BALL_SIZE
} from './ball'

export default class Spiral {
        constructor(layer) {
                this.setupBalls(layer)
        }

        setupBalls(layer) {
                this.balls = []

                let xOffset = BALL_SIZE / Math.sqrt(3)
                let xSeparation = BALL_SIZE / Math.sqrt(3) * 2

                let initX = canvas.width / 2 - BALL_SIZE * (layer + 1) / 2
                let initY = canvas.height / 2 - BALL_SIZE * (layer + 1)

                for (let row = 0; row <= layer; row++) {
                        for (let col = 0; col <= layer + row; col++) {
                                this.balls.push(new Ball(
                                        initX - row * xOffset + col * xSeparation,
                                        initY + row * BALL_SIZE))
                        }
                }

                initX = initX - (layer - 1) * xOffset
                initY = initY + (layer + 1) * BALL_SIZE

                for (let row = layer; row > 0; row--) {
                        for (let col = 0; col < layer + row; col++) {
                                this.balls.push(new Ball(
                                        initX + (layer - row) * xOffset + col * xSeparation,
                                        initY + (layer - row) * BALL_SIZE))
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