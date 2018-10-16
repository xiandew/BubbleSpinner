import Sprite, {SHAPE} from './sprite'

// gray: #888888
const COLOURS = ['#1da2da', '#014765', '#01986a', '#d392ba', '#b14701', '#ecd613']
export const BALL_SIZE = 20
export default class Ball extends Sprite {
        constructor(x, y) {
		super(COLOURS[Math.floor(Math.random() * COLOURS.length)], BALL_SIZE, BALL_SIZE, x, y, [SHAPE])
        }
}