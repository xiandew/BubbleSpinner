import Spiral from './spiral'

let ctx = canvas.getContext('2d')
//ctx.imageSmoothingQuality = "high"

// The entry class of the game
export default class Main{
        constructor(){
                this.setup()
        }
        setup(){
                // initialise the spiral with the number of layers
                this.spiral = new Spiral(6)
                // the shoot ball controlled by the player
                // this.shooter = new Shooter()

                this.bindLoop = this.loop.bind(this)
                requestAnimationFrame(this.bindLoop)

        }
        update(){
                
        }

        render(){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.fillStyle = "#ffffff"
		ctx.fillRect(0, 0, canvas.width, canvas.height)

                this.spiral.render(ctx)
                
        }

        // loop all the frames
        loop() {
                
                
                this.update()
                this.render()
                
                requestAnimationFrame(this.bindLoop)
        }
}