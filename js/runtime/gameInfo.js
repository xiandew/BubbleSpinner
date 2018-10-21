export const LEVELS = [2, 3, 4, 5]
export default class GameInfo{
	constructor(){
		this.restart()
	}
	restart(){
		this.level = 0
		this.score = 0
		this.start = false
	}
}