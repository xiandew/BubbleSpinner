export const LEVELS = [2, 3, 4, 5, 6]
export default class GameInfo{
	constructor(){
		this.start = false
		this.startArea = {
			startX: canvas.width / 2 - 40,
			startY: canvas.height / 2 - 20,
			endX: canvas.height / 2 + 40,
			endY: canvas.height / 2
		}
		this.restart()
	}
	restart(){
		this.level = 0
		this.score = 0
	}
	renderGameStart(ctx){
		ctx.fillStyle = "#ffffff"
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		ctx.fillStyle = "#000000"
		ctx.font = "bold 20px Arial"
		ctx.fillText('开始游戏', canvas.width / 2 - 40, canvas.height / 2 - 20)
	}
}