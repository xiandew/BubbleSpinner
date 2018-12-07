import GameInfo from "../runtime/gameInfo";
import Hole from "../hole";
let gameInfo = new GameInfo();

module.exports = function(target) {

        for (let i = 0; i < gameInfo.holes.length; i++) {
                let hole = gameInfo.holes[i];
                if (!(hole instanceof Hole) && hole.isCollideWith(target)) {
                        return hole;
                }
        }
        return false;
}