import GameInfo from "../runtime/gameInfo";
import Hole from "../hole";
let gameInfo = GameInfo.getInstance();

module.exports = function(target) {

        for (let i = 0, ball; i < gameInfo.balls.length; i++) {
                ball = gameInfo.balls[i];
                if (
                        ball.visible &&
                        ball.dropping == undefined &&
                        ball.isCollideWith(target)
                ) {
                        return true;
                }
        }
        return false;
}