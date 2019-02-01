import GameInfo from './runtime/gameInfo';
let gameInfo = new GameInfo();

export default class Hole {
        constructor(x = 0, y = 0, layer = 0) {
                this.x = x;
                this.y = y;
                this.layer = layer;
        }

        rotate(angle) {
                let toCentY = this.y - gameInfo.canvasHeight / 2;
                let toCentX = this.x - gameInfo.canvasWidth / 2;

                let radius = Math.sqrt(toCentX ** 2 + toCentY ** 2);
                this.x = gameInfo.canvasWidth / 2 + (Math.cos(Math.atan2(toCentY, toCentX) - angle) * radius);
                this.y = gameInfo.canvasHeight / 2 + (Math.sin(Math.atan2(toCentY, toCentX) - angle) * radius);
        }
}