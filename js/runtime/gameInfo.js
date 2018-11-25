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

        getLayers() {
                return this.level < LAYERS.length ? LAYERS[this.level] : LAYERS[LAYERS.length - 1];
        }

	renewLives() {
		this.lives = MAX_NUM_LIVES;
		this.loseLive = false;
	}
}