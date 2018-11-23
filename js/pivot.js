import { BALL_SIZE } from './runtime/gameInfo';
import Ball from './ball';

const PIVOT_SRC = 'images/pivot.png';

export default class Pivot extends Ball{
	constructor(hole){
		super(hole, PIVOT_SRC);
		this.width = BALL_SIZE;
		this.height = Math.sqrt((BALL_SIZE / 2) ** 2 - (BALL_SIZE / 4) ** 2) * 2;
	}
}