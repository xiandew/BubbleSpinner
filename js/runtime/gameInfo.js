import Pool from './pool'

let instance;
let ctx = canvas.getContext('2d');

const MAX_NUM_LIVES = 5;

const LAYERS = [2, 3, 4, 5, 6];

export const BALLS_SRC = [
        'images/b_blue.png',
        'images/b_cyan.png',
        'images/b_green.png',
        'images/b_pink.png',
        'images/b_red.png',
        'images/b_yellow.png'
];
export const BALL_SIZE = 0.055 * canvas.width;

// SHOOTER_SPEED = 12.8 when screenWidth = 320 and pixelRatio = 2;
export const SHOOTER_SPEED = canvas.width * wx.getSystemInfoSync().pixelRatio * (3 / 150);

/*----------------------------------------------------------------------------*/

export default class GameInfo {
        constructor() {
                if (instance) {
                        return instance;
                }
                instance = this;

                this.pixelRatio = wx.getSystemInfoSync().pixelRatio;

                // onscreen canvas
                this.canvasWidth = canvas.width;
                this.canvasHeight = canvas.height;
                canvas.width *= this.pixelRatio;
                canvas.height *= this.pixelRatio;
                ctx.scale(this.pixelRatio, this.pixelRatio);

                // shared canvas
                this.openDataContext = wx.getOpenDataContext();
                this.sharedCanvas = this.openDataContext.canvas;
                // resize the sharedCanvas for better display of text.
                this.sharedCanvas.width = canvas.width * this.pixelRatio;
                this.sharedCanvas.height = canvas.height * this.pixelRatio;

                this.pool = new Pool();

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
                let temp = this.enemys.shift()
                temp.visible = false;

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