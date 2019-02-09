import GameInfo, {
        BALL_SIZE
} from '../runtime/gameInfo';
let gameInfo = new GameInfo();

module.exports = function(hole, angle) {
        let toCentY = hole.y - gameInfo.canvasHeight / 2;
        let toCentX = hole.x - gameInfo.canvasWidth / 2;

        let radius = Math.sqrt(toCentX ** 2 + toCentY ** 2);
        hole.x =
                gameInfo.canvasWidth / 2 +
                Math.cos(Math.atan2(toCentY, toCentX) - angle) * radius;
        hole.y =
                gameInfo.canvasHeight / 2 +
                Math.sin(Math.atan2(toCentY, toCentX) - angle) * radius;


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