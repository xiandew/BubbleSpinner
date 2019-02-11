import GameInfo from '../runtime/gameInfo';
import Ball from '../ball';

let gameInfo = new GameInfo();
let thisBall, prevBall;

// return a ball with the colour which is of the minimum number on the spiral
module.exports = function() {
        let balls = gameInfo.getBallsImg();

        let dict = {};
        balls.forEach((ballImg, i) => {
                dict[i] = 0;
        });

        gameInfo.balls.forEach(ball => {
                if (ball != gameInfo.pivot) {
                        dict[balls.indexOf(ball.img)]++;
                }
        });

        let arr = [];
        for (let key in dict) {
                arr.push({
                        i: key,
                        count: dict[key]
                });
        }
        arr.sort((b1, b2) => {
                return b1.count - b2.count;
        });

        arr.length > 1 && prevBall ? arr.filter(ball => ball.i != prevBall) : true;
        arr = arr.filter(ball => ball.count == arr[0].count);

        thisBall = prevBall = balls[arr[Math.floor(Math.random() * arr.length)].i];
        return thisBall;
}