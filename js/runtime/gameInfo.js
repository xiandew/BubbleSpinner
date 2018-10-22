let instance

const LEVELS = [2, 3, 4, 5, 6]
export default class GameInfo{
	constructor(){
		if(instance){
			return instance
		}
		instance = this

		this.start = false
		this.startArea = {
			startX: canvas.width / 2 - 70,
			startY: canvas.height / 2 - 50,
			endX: canvas.height / 2 + 70,
			endY: canvas.height / 2
		}
		this.level = 0
		this.score = 0
	}
	reset(){
		this.start = true
		this.over = false
		this.levelup = false
		this.level = 0
		this.score = 0
	}

	getLayers(){
		return this.level < LEVELS.length ? LEVELS[this.level] : LEVELS[LEVELS.length - 1]
	}

	renderGameStart(ctx){
		ctx.beginPath()
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		this.roundRect(ctx, this.startArea.startX, this.startArea.startY, 140, 48, 24)

		ctx.fillStyle = "#ffffff"
		ctx.font = "20px Arial"
		ctx.fillText('开始游戏', canvas.width / 2 - 40, canvas.height / 2 - 20, 140)
		ctx.closePath()
	}

	roundRect(ctx, x, y, w, h, r) {
		if (w < 2 * r){
			r = w / 2
		}
		if (h < 2 * r){
			r = h / 2
		}
		ctx.beginPath()
		ctx.moveTo(x + r, y)
		ctx.arcTo(x + w, y, x + w, y + h, r)
		ctx.arcTo(x + w, y + h, x, y + h, r)
		ctx.arcTo(x, y + h, x, y, r)
		ctx.arcTo(x, y, x + w, y, r)
		ctx.fillStyle = '#888888'
		ctx.fill()
		ctx.closePath()
	}

	renderGameScore(ctx){
		ctx.beginPath
		ctx.fillStyle = "#000000"
		ctx.font = "20px Arial"

		ctx.fillText(
			this.score,
			10,
			30
		)
		ctx.closePath
	}

	renderGameOver(ctx) {
		ctx.beginPath()
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		this.roundRect(ctx, this.startArea.startX, this.startArea.startY, 140, 48, 24)

		ctx.fillStyle = "green"
		ctx.font = "50px Arial"
		let offset = ctx.measureText(this.score).width / 2
		ctx.fillText(this.score, canvas.width / 2 - offset, canvas.height / 2 - 100, 140)

		ctx.fillStyle = "#ffffff"
		ctx.font = "20px Arial"
		ctx.fillText('重新开始', canvas.width / 2 - 40, canvas.height / 2 - 20, 140)
		ctx.closePath()
	}
}