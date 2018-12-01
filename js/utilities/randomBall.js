import GameInfo, { BALLS } from '../runtime/gameInfo';
import Ball from '../ball';
import Pivot from "../pivot";

let gameInfo = new GameInfo();

module.exports = function() {
	let balls = gameInfo.getBalls();

	return balls[Math.floor(Math.random() * balls.length)];
	
	// let ballDict = {};
	// BALLS.forEach(ballSrc => {
	// 	ballDict[ballSrc] = 0;
	// });

	// gameInfo.holes.forEach(ball => {
	// 	if (ball instanceof Ball && !(ball instanceof Pivot)) {
	// 		let ballSrc = ball.img.src;
	// 		ballDict[ballSrc.substring(ballSrc.lastIndexOf("images/"))]++;
	// 	}
	// });

	// let ballArr = [];
	// for(let key in ballDict){
	// 	ballArr.push({ballSrc: key, count: ballDict[key]});
	// }
	// ballArr.sort((b1, b2) => {
	// 	return b1.count - b2.count;
	// })
	// ballArr = ballArr.filter(ball => ball.count == ballArr[0].count);
	
	// return ballArr[Math.floor(Math.random() * ballArr.length)].ballSrc;

};