import Pool from './pool'

let instance;
let ctx = canvas.getContext('2d');

/*----------------------------------------------------------------------------*/

const MAX_NUM_LIVES = 5;
const LAYERS = [2, 3, 4, 5, 6];

/*----------------------------------------------------------------------------*/

let newImage = require('../utilities/newImage');
let pixelRatio = wx.getSystemInfoSync().pixelRatio;
let scaledCanvasWidth = canvas.width * pixelRatio;
let scaledCanvasHeight = canvas.height * pixelRatio;

/*----------------------------------------------------------------------------*/

export const BALLS_IMG = [
        newImage('images/b_blue.png'),
        newImage('images/b_cyan.png'),
        newImage('images/b_green.png'),
        newImage('images/b_pink.png'),
        newImage('images/b_red.png'),
        newImage('images/b_yellow.png')
];

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

                this.pixelRatio = pixelRatio;

                // onscreen canvas
                this.canvasWidth = canvas.width;
                this.canvasHeight = canvas.height;
                canvas.width = scaledCanvasWidth;
                canvas.height = scaledCanvasHeight;
                ctx.scale(this.pixelRatio, this.pixelRatio);

                // shared canvas
                this.openDataContext = wx.getOpenDataContext();
                this.sharedCanvas = this.openDataContext.canvas;
                // resize the sharedCanvas for better display of text.
                this.sharedCanvas.width = scaledCanvasWidth;
                this.sharedCanvas.height = scaledCanvasHeight;

                this.pool = new Pool();

                this.outerLayer = LAYERS[1];
                this.ballsImg = shuffle(BALLS_IMG);
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

        getBallsImg() {
                return this.ballsImg.slice(0, this.getLayers() + 1);
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