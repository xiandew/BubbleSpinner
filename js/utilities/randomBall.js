import GameInfo from '../runtime/gameInfo';
let gameInfo = new GameInfo();

let thisBall, prevBall;
module.exports = function() {
        let balls = gameInfo.getBallsImg();

        prevBall ? balls.splice(balls.indexOf(prevBall), 1) : true;
        thisBall = prevBall = balls[Math.floor(Math.random() * balls.length)];

        return thisBall;
};