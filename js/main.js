import Ball from './ball'

let ctx = canvas.getContext('2d')

// The entry class of the game
export default class Main{
        constructor(){
                this.initialise()
                this.loop()
        }
        initialise(){
                // balls on the spiral
                this.balls = []
                // the shoot ball controlled by the player
                // this.shooter = new Shooter()

        }
        update(){
                this.balls.push(new Ball(0, 0))
        }

        render(){
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                this.balls.forEach(ball => ball.render(ctx))
        }

        // loop all the frames
        loop() {
                this.update()
                this.render()
        }
}