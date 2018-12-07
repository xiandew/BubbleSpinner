let instance;
let ctx = canvas.getContext('2d');

const MAX_NUM_LIVES = 5;

const LAYERS = [2, 3, 4, 5, 6];

export const BALLS = [
        'images/b_blue.png',
        'images/b_cyan.png',
        'images/b_green.png',
        'images/b_pink.png',
        'images/b_red.png',
        'images/b_yellow.png'
];
export const BALL_SIZE = 0.055 * canvas.width;
// SHOOTER_SPEED = 15 when canvas.width = 320;
export const SHOOTER_SPEED = canvas.width * 3 / 64;

/*----------------------------------------------------------------------------*/

export default class GameInfo {
        constructor() {
                if (instance) {
                        return instance;
                }
                instance = this;

                this.openDataContext = wx.getOpenDataContext();
                this.sharedCanvas = this.openDataContext.canvas;

                // resize the sharedCanvas for better display of text.
                this.pixelRatio = wx.getSystemInfoSync().pixelRatio;
                this.sharedCanvas.width = canvas.width * this.pixelRatio;
                this.sharedCanvas.height = canvas.height * this.pixelRatio;

                this.balls = shuffle(BALLS);

                this.holes = [];
                this.start = false;
                this.level = 0;
                this.score = 0;
                this.lives = MAX_NUM_LIVES;
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

        getBalls() {
                return this.balls.slice(0, this.getLayers() + 1);
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

export const SHARE_IMG = [
        'images/share/b_blue.png',
        'images/share/b_cyan.png',
        'images/share/b_green.png',
        'images/share/b_pink.png',
        'images/share/b_red.png',
        'images/share/b_yellow.png'
];