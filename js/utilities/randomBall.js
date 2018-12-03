import GameInfo from '../runtime/gameInfo';
let gameInfo = new GameInfo();

module.exports = function() {
	let balls = gameInfo.getBalls();
	return balls[Math.floor(Math.random() * balls.length)];
};