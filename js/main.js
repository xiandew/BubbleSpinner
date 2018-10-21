import Spiral from './spiral'
import Shooter from './shooter'
import GameInfo from './runtime/gameInfo'

let ctx = canvas.getContext('2d')
ctx.imageSmoothingQuality = "high"

// The entry class of the game
export default class Main {
        constructor() {
		this.gameInfo = new GameInfo()

		this.touchHandler = this.touchEventHandler.bind(this)
		canvas.addEventListener('touchstart', this.touchEventHandler.bind(this))

		this.bindLoop = this.loop.bind(this)
		requestAnimationFrame(this.bindLoop)
        }
        setup() {
		// initialise the spiral with the number of layers
		this.spiral = new Spiral(6)
		// the shoot ball controlled by the player
		this.shooter = new Shooter()		
        }
        update() {
		if (!this.gameInfo.start) {
			return
		}
                this.shooter.update(this.spiral)
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

                this.shooter.render(ctx)
                this.spiral.render(ctx)
        }

	touchEventHandler(e) {
		e.preventDefault()

		let x = e.touches[0].clientX
		let y = e.touches[0].clientY

		let area = this.gameInfo.startArea

		if (x >= area.startX && x <= area.endX && y >= area.startY && y <= area.endY){
			this.gameInfo.start = true
			canvas.removeEventListener('touchstart', this.touchHandler)
			this.gameInfo.restart()
			this.setup()
		}
	}

        // loop all the frames
        loop() {
                this.update()
                this.render()

                requestAnimationFrame(this.bindLoop)
        }
}