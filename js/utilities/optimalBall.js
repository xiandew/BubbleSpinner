import GameInfo from '../runtime/gameInfo';
import Ball from '../ball';

let gameInfo = GameInfo.getInstance();
let thisBall, prevBall;

// return a ball with the colour which is of the minimum number on the spiral
module.exports = function() {
        let balls = gameInfo.getBallsSrc();

        let dict = {};
        balls.forEach(ballSrc => {
                dict[ballSrc] = 0;
        });

        gameInfo.holes.forEach(ball => {
                if (ball != gameInfo.pivot && ball instanceof Ball) {
                        dict[ball.imgSrc]++;
                }
        });

        let arr = [];
        for (let key in dict) {
                arr.push({
                        src: key,
                        count: dict[key]
                });
        }
        arr.sort((b1, b2) => {
                return b1.count - b2.count;
        });

        arr.length > 1 && prevBall ? arr.filter(ball => ball.src != prevBall) : true;
        arr = arr.filter(ball => ball.count == arr[0].count);

        thisBall = prevBall = arr[Math.floor(Math.random() * arr.length)].src;
        return thisBall;
}