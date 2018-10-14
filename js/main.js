import Ball from './ball'

let ctx = canvas.getContext('2d')

// The entry class of the game
export default class Main{
        constructor(){
                this.i = 0
                this.initialise()
        }
        initialise(){
                // balls on the spiral
                this.balls = []
                // the shoot ball controlled by the player
                // this.shooter = new Shooter()

                this.bindLoop = this.loop.bind(this)
                requestAnimationFrame(this.bindLoop)

        }
        update(){
                this.balls.splice(0, 1, new Ball(this.i, 0))
                this.i ++
                
        }

        render(){
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                this.balls.forEach((ball) => {ball.render(ctx)})
                
        }

        // loop all the frames
        loop() {
                
                
                this.update()
                this.render()
                
                requestAnimationFrame(this.bindLoop)
        }
}