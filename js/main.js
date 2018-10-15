import Spiral from './spiral'
import Shooter from './shooter'

let ctx = canvas.getContext('2d')
// ctx.imageSmoothingQuality = "high"

// The entry class of the game
export default class Main{
        constructor(){
                this.setup()
        }
        setup(){
                // initialise the spiral with the number of layers
                this.spiral = new Spiral(5)
		this.shooter = new Shooter()
                // the shoot ball controlled by the player
                // this.shooter = new Shooter()

                this.bindLoop = this.loop.bind(this)
                requestAnimationFrame(this.bindLoop)

        }
        update(){
		this.shooter.update(this.spiral)
		this.spiral.update()
        }

        render(){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.fillStyle = "#ffffff"
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		this.shooter.render(ctx)
		this.spiral.render(ctx)
        }

        // loop all the frames
        loop() {
                this.update()
                this.render()
                
                requestAnimationFrame(this.bindLoop)
        }
}
