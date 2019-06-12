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
const SHOOTER_SPEED = scaledCanvasWidth * 0.02;
const BALL_SIZE = Math.ceil(0.055 * canvas.width);

/*----------------------------------------------------------------------------*/

export default class GameInfo {
        constructor() {
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

                this.outerLayer = LAYERS[1];
                this.ballsSrc = shuffle(BALLS_SRC);
                this.holes = [];

                // balls in this.holes
                this.balls = new Set([]);

                this.reset();
                this.start = false;
        }

        static getInstance() {
                if (!instance) {
                        instance = new GameInfo();
                }
                return instance;
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

        getBallSize() {
                return BALL_SIZE;
        }

        getShooterSpeed() {
                return SHOOTER_SPEED;
        }

        renewLives() {
                this.lives = Math.ceil(Math.random() * MAX_NUM_LIVES);
                this.loseLive = false;
        }
}

function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
}