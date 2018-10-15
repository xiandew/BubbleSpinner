import Spiral from './spiral'

let ctx = canvas.getContext('2d')

// The entry class of the game
export default class Main{
        constructor(){
                this.i = 0
                this.setup()
        }
        setup(){
                // initialise the spiral with the number of layers
                this.spiral = new Spiral(5)
                // the shoot ball controlled by the player
                // this.shooter = new Shooter()

                this.bindLoop = this.loop.bind(this)
                requestAnimationFrame(this.bindLoop)

        }
        update(){
                
        }

        render(){
                this.spiral.render(ctx)
                
        }

        // loop all the frames
        loop() {
                
                
                this.update()
                this.render()
                
                requestAnimationFrame(this.bindLoop)
        }
}