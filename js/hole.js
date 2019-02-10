import GameInfo, {
        BALL_SIZE
} from './runtime/gameInfo';
let gameInfo = new GameInfo();

let centY = gameInfo.canvasHeight / 2;
let centX = gameInfo.canvasWidth / 2;
let toCentY;
let toCentX;
let radius;
let rotatingAngle;

export default class Hole {
        constructor(x = 0, y = 0, layer = 0) {
                this.x = x;
                this.y = y;
                this.layer = layer;
                this.filled = false;
        }

        static rotate(hole, angle) {
                toCentY = hole.y - centY;
                toCentX = hole.x - centX;
                radius = Math.sqrt(toCentX ** 2 + toCentY ** 2);
                rotatingAngle = Math.atan2(toCentY, toCentX) - angle;

                hole.x = centX + Math.cos(rotatingAngle) * radius;
                hole.y = centY + Math.sin(rotatingAngle) * radius;

                if (
                        hole.filled &&
                        (
                                (hole.x + BALL_SIZE / 2) >= gameInfo.canvasWidth ||
                                (hole.y + BALL_SIZE / 2) >= gameInfo.canvasHeight ||
                                (hole.x - BALL_SIZE / 2) <= 0 ||
                                (hole.y - BALL_SIZE / 2) <= 0
                        )
                ) {
                        return true;
                }
        }
}