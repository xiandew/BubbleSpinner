import Sprite from './sprite'

const BALLS_SRC =
        ['images/b_blue.png',
         'images/b_cyan.png', 
         'images/b_green.png',
         'images/b_pink.png',
         'images/b_red.png',
         'images/b_yellow.png']
const NUM_SRC = 6

export default class Ball extends Sprite {
        constructor(x, y) {
                super(BALLS_SRC[Math.floor(Math.random()*NUM_SRC)], 50, 50, x, y)
        }
}