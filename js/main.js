import Spiral from './spiral'
import Shooter from './shooter'
import GameInfo from './runtime/gameInfo'

let ctx = canvas.getContext('2d')
ctx.imageSmoothingQuality = "high"

let gameInfo = new GameInfo()
// The entry class of the game
export default class Main {
        constructor() {
		// initialise the spiral with the number of layers
		this.spiral = new Spiral(gameInfo.getLayers())
		// the shoot ball controlled by the player
		this.shooter = new Shooter()

		this.touchstarter = this.touchstartHandler.bind(this)
		canvas.addEventListener('touchstart', this.touchstarter)

		this.touchender = this.touchendHandler.bind(this)
		canvas.addEventListener('touchend', this.touchender)

		// make sure only add event listener once in `update`
		this.hasEventBind = true
		
		this.bindLoop = this.loop.bind(this)
		requestAnimationFrame(this.bindLoop)
        }

        restart() {
		this.spiral.initSpiral(gameInfo.getLayers())
		this.shooter.initEvent()
		this.hasEventBind = false
        }
        update() {

		this.shooter.update(this.spiral)
                this.spiral.update()

		if(gameInfo.levelup){
			this.restart()
			gameInfo.levelup = false
		}

		if (gameInfo.over && !this.hasEventBind) {
			this.shooter.removeEvent()

			canvas.addEventListener('touchstart', this.touchstarter)
			canvas.addEventListener('touchend', this.touchender)
			this.hasEventBind = true
		}
        }

        render() {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = "#ffffff"
                ctx.fillRect(0, 0, canvas.width, canvas.height)

		this.shooter.render(ctx)
                this.spiral.render(ctx)

		gameInfo.renderGameScore(ctx)
		if (!gameInfo.start) {
			gameInfo.renderGameStart(ctx)
		}
		if(gameInfo.over){
			gameInfo.renderGameOver(ctx)
		}
        }

	touchstartHandler(e) {
		e.preventDefault()
		let x = e.touches[0].clientX
		let y = e.touches[0].clientY
		let area = gameInfo.startArea

		if (x >= area.startX && x <= area.endX && y >= area.startY && y <= area.endY){
			gameInfo.reset()
			canvas.removeEventListener('touchstart', this.touchstarter)
		}
	}

	touchendHandler(e){
		e.preventDefault()
		if (gameInfo.start){
			this.restart()
			canvas.removeEventListener('touchend', this.touchender)
		}
	}

        // loop all the frames
        loop() {
                this.update()
                this.render()

                requestAnimationFrame(this.bindLoop)
        }
}