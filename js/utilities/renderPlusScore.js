import GameInfo, {
        BALL_SIZE
} from '../runtime/gameInfo';

/*----------------------------------------------------------------------------*/

import IMPACT_BLACK_JSON from '../../fonts/impact_black';
import BitmapFont from './bitmapFont';
import BitmapText from './bitmapText';
let impact_black = new BitmapFont();
let fontLoaded = false;
let txt;
impact_black.loadFont(IMPACT_BLACK_JSON, function() {
        fontLoaded = true;
        txt = new BitmapText(impact_black);
});

/*----------------------------------------------------------------------------*/

let gameInfo = new GameInfo();
let ctx = canvas.getContext('2d');

module.exports = function(ball) {
        if (
                ball.dropping == undefined ||
                ball.getY() <= gameInfo.canvasHeight - 5 * ball.size
        ) {
                return;
        }

        if (!ball.scoreX || !ball.scoreY) {
                ball.scoreX =
                        ball.getX() <=
                        BALL_SIZE ?
                        BALL_SIZE :
                        ball.getX() >=
                        gameInfo.canvasWidth - BALL_SIZE ?
                        gameInfo.canvasWidth - BALL_SIZE :
                        ball.getX();
                ball.scoreY = ball.getY();
        }

        ctx.save();
        ctx.globalAlpha = 1 - Math.sin(ball.acc);
        if (fontLoaded) {
                txt.fontSize = 0.065 * gameInfo.canvasWidth;
                txt.textAlign = "center";
                txt.draw(
                        ctx,
                        `+${gameInfo.getEachWorth()}`,
                        ball.scoreX,
                        ball.scoreY - Math.sin(ball.acc) * 30
                );
        }
        ctx.restore();

        if (ball.acc >= Math.PI / 2) {
                ball.acc = Math.PI / 2;

                gameInfo.removeBall(ball);
                gameInfo.score += gameInfo.getEachWorth();
        }

        if (ball.dropping) {
                ball.acc += 0.035;
        }
}