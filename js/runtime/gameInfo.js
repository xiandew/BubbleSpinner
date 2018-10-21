export const LEVELS = [2, 3, 4, 5, 6]
export default class GameInfo{
	constructor(){
		this.start = false
		this.startArea = {
			startX: canvas.width / 2 - 70,
			startY: canvas.height / 2 - 50,
			endX: canvas.height / 2 + 70,
			endY: canvas.height / 2
		}
	}
	restart(){
		this.start = true
		this.level = 0
		this.score = 0
	}
	renderGameStart(ctx){
		ctx.beginPath()
		ctx.fillStyle = "#ffffff"
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
}