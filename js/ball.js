import Sprite from './sprite'

const BALLS_SRC =
        ['images/b_blue.png',
         'images/b_cyan.png', 
         'images/b_green.png',
         'images/b_pink.png',
         'images/b_red.png',
         'images/b_yellow.png']
const NUM_BALLS = 6
export const BALL_SIZE = 25
export default class Ball extends Sprite {
        constructor(x, y) {
                super(BALLS_SRC[Math.floor(Math.random() * NUM_BALLS)], BALL_SIZE, BALL_SIZE, x, y)
        }
}