import GameInfo from '../runtime/gameInfo';
let gameInfo = GameInfo.getInstance();

let thisBall, prevBall;
module.exports = function() {
        let balls = gameInfo.getBallsSrc();

        prevBall ? balls.splice(balls.indexOf(prevBall), 1) : true;
        thisBall = prevBall = balls[Math.floor(Math.random() * balls.length)];

        return thisBall;
};