import GameInfo from "../runtime/gameInfo";
import Hole from "../hole";
let gameInfo = new GameInfo();

module.exports = function(target) {

        for (let i = 0, ball; i < gameInfo.balls.length; i++) {
                ball = gameInfo.balls[i];
                if (
                        ball.visible &&
                        ball.isCollideWith(target)
                ) {
                        return true;
                }
        }
        return false;
}