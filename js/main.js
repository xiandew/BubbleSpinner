import Spiral from './spiral'
import Shooter from './shooter'
import GameInfo from './runtime/gameInfo'

let ctx = canvas.getContext('2d')
ctx.imageSmoothingQuality = "high"

// The entry class of the game
export default class Main {
        constructor() {
		this.setup()

		this.bindLoop = this.loop.bind(this)
		requestAnimationFrame(this.bindLoop)
		this.t = false
        }
        setup() {
		this.gameInfo = new GameInfo()
		// initialise the spiral with the number of layers
		this.spiral = new Spiral(6)
		// the shoot ball controlled by the player
		this.shooter = new Shooter()
		
		this.touchStarter = this.touchStartHandler.bind(this)
		canvas.addEventListener('touchstart', this.touchStarter)
		
		this.touchEnder = this.touchEndHandler.bind(this)
		canvas.addEventListener('touchend', this.touchEnder)
        }
        update() {
		if(this.t){
			this.shooter.initEvent()
			this.shooter.t = true
			if(this.shooter.x && this.shooter.y){
				this.shooter.update(this.spiral)
			} else {
				this.shooter.init()
			}
		}
                this.spiral.update()
        }

        render() {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = "#ffffff"
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                if (!this.gameInfo.start) {
			this.gameInfo.renderGameStart(ctx)
			return
                }

		if (this.t) {
                	this.shooter.render(ctx)
		}
                this.spiral.render(ctx)
        }

	touchStartHandler(e) {
		e.preventDefault()

		let x = e.touches[0].clientX
		let y = e.touches[0].clientY

		let area = this.gameInfo.startArea

		if (x >= area.startX && x <= area.endX && y >= area.startY && y <= area.endY){
			//this.gameInfo.restart()
			canvas.removeEventListener('touchstart', this.touchStarter)
			
		}
	}

	touchEndHandler(e){
		this.gameInfo.start = true
		this.t = true
		canvas.removeEventListener('touchend', this.touchEnder)
	}

        // loop all the frames
        loop() {
                this.update()
                this.render()

                requestAnimationFrame(this.bindLoop)
        }
}