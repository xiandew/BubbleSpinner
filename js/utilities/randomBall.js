import GameInfo from '../runtime/gameInfo';
import Ball from '../ball';

let gameInfo = new GameInfo();

module.exports = function() {
	gameInfo.holes.forEach(ball => {
		if (ball instanceof Ball) {
			
		}
	});
};