import GameInfo from './runtime/gameInfo';
import Sprite from "./sprite";
let gameInfo = GameInfo.getInstance();

let ballSize = gameInfo.getBallSize();
let centY = gameInfo.canvasHeight / 2;
let centX = gameInfo.canvasWidth / 2;
let toCentY;
let toCentX;
let radius;
let rotatingAngle;

export default class Hole extends Sprite {
        constructor(x = 0, y = 0, layer = 0) {
		super(x, y);
                this.layer = layer;
                this.filled = false;
        }

	rotate(angle) {
		toCentY = this.y - centY;
		toCentX = this.x - centX;
		radius = Math.sqrt(toCentX ** 2 + toCentY ** 2);
		rotatingAngle = Math.atan2(toCentY, toCentX) - angle;

		this.x = centX + Math.cos(rotatingAngle) * radius;
		this.y = centY + Math.sin(rotatingAngle) * radius;

		if (
			this.filled &&
			(
				(this.x + ballSize / 2) >= gameInfo.canvasWidth ||
				(this.y + ballSize / 2) >= gameInfo.canvasHeight ||
				(this.x - ballSize / 2) <= 0 ||
				(this.y - ballSize / 2) <= 0
			)
		) {
			return true;
		}
	}
}