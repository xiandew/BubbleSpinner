import Pool from './pool'

let instance;
let ctx = canvas.getContext('2d');

/*----------------------------------------------------------------------------*/

const MAX_NUM_LIVES = 5;
const LAYERS = [2, 3, 4, 5, 6];

/*----------------------------------------------------------------------------*/

export const BALLS_CVS = {};
export const BALLS_SRC = [
        'images/b_blue.png',
        'images/b_cyan.png',
        'images/b_green.png',
        'images/b_pink.png',
        'images/b_red.png',
        'images/b_yellow.png'
];

/*----------------------------------------------------------------------------*/

export const PIXEL_RATIO = wx.getSystemInfoSync().pixelRatio;

let newImage = require('../utilities/newImage');
let scaledCanvasWidth = canvas.width * PIXEL_RATIO;
let scaledCanvasHeight = canvas.height * PIXEL_RATIO;

// SHOOTER_SPEED = 12.8 when screenWidth = 320 and pixelRatio = 2;
export const SHOOTER_SPEED = scaledCanvasWidth * 0.02;
export const BALL_SIZE = Math.ceil(0.055 * canvas.width);

/*----------------------------------------------------------------------------*/

export default class GameInfo {
        constructor() {
                if (instance) {
                        return instance;
                }
                instance = this;

                this.pixelRatio = PIXEL_RATIO;

                // onscreen canvas
                this.canvasWidth = canvas.width;
                this.canvasHeight = canvas.height;
                canvas.width = scaledCanvasWidth;
                canvas.height = scaledCanvasHeight;
                ctx.scale(PIXEL_RATIO, PIXEL_RATIO);

                // shared canvas
                this.openDataContext = wx.getOpenDataContext();
                this.sharedCanvas = this.openDataContext.canvas;
                // resize the sharedCanvas for better display of text.
                this.sharedCanvas.width = scaledCanvasWidth;
                this.sharedCanvas.height = scaledCanvasHeight;

                this.pool = new Pool();

                this.outerLayer = LAYERS[1];
                this.ballsSrc = shuffle(BALLS_SRC);
                this.holes = [];
                this.balls = [];

                this.reset();
                this.start = false;
        }

        reset() {
                this.start = true;
                this.over = false;
                this.levelup = false;
                this.level = 0;
                this.score = 0;

                this.renewLives();
        }

        getEachWorth() {
                // 1, 1, 1, 2, 3, 4..
                return this.level <= 2 ? 1 : this.level - 1;
        }

        getLayers() {
                return this.level < LAYERS.length ? LAYERS[this.level] : LAYERS[LAYERS.length - 1];
        }

        getBallsSrc() {
                return this.ballsSrc.slice(0, this.getLayers() + 1);
        }

        renewLives() {
                this.lives = Math.ceil(Math.random() * MAX_NUM_LIVES);
                this.loseLive = false;
        }

        /**
         * 回收小球，进入对象池
         * 此后不进入帧循环
         */
        removeBall(ball) {
                // remove the ball
                let i = this.balls.indexOf(ball);
                [this.balls[0], this.balls[i]] = [this.balls[i], this.balls[0]];
                let temp = this.balls.shift();
                temp.visible = false;

                // clean up the removed ball
                if (temp.hole) {
                        temp.hole.filled = false;
                        temp.hole = null;
                }
                temp.dropping = undefined;
                temp.scoreX = undefined;
                temp.scoreY = undefined;
                temp.speedX = undefined;
                temp.speedY = undefined;
                temp.visited = false;
                temp.acc = 0;

                // recycle the ball
                this.pool.recover('ball', ball);
        }
}

function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
}

export const SHARE_IMG = [
        'images/share/b_blue.png',
        'images/share/b_cyan.png',
        'images/share/b_green.png',
        'images/share/b_pink.png',
        'images/share/b_red.png',
        'images/share/b_yellow.png'
];