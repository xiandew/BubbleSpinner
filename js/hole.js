export default class Hole {
	constructor(x, y, layer){
		this.x = x;
		this.y = y;
		this.layer = layer;
	}

	rotate(angle) {
		let toCentY = this.y - canvas.height / 2;
		let toCentX = this.x - canvas.width / 2;

		let radius = Math.sqrt(toCentX ** 2 + toCentY ** 2);
		this.x = canvas.width / 2 + (Math.cos(Math.atan2(toCentY, toCentX) - angle) * radius);
		this.y = canvas.height / 2 + (Math.sin(Math.atan2(toCentY, toCentX) - angle) * radius);
	}
}