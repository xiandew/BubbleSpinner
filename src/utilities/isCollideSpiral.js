import GameInfo from "../runtime/gameInfo";
let gameInfo = GameInfo.getInstance();
import Shooter from "../components/shooter";

module.exports = function(target) {
        for (let ball of Array.from(gameInfo.balls).concat(gameInfo.pivot)) {
                if (ball.visible &&
                        ball.dropping == undefined &&
                        ball.isCollideWith(target)) {
                        return true;
                }
        }
        return false;
}