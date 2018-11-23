import IMPACT_WHITE_JSON from './fonts/impact_white';
import BitmapFont from "./utilities/bitmapFont";
import BitmapText from "./utilities/bitmapText";

let instance;

// Used to share the common information for modules,
// for drawing ranks first if they are defined and updating
// later when getting new info.
export default class Shared{
	constructor() {
		if (instance) {
			return instance;
		}
		instance = this;

		let sharedCanvas = wx.getSharedCanvas();
		this.ctx = sharedCanvas.getContext('2d');

		// Draw on the shared canvas with respect to width of 750.
		let scale = sharedCanvas.width / 750;
		this.ctx.scale(scale, scale);

		this.canvasWidth = 750;
		this.canvasHeight = 750 * sharedCanvas.height / sharedCanvas.width;

		this.selfRankIndex = undefined;
		this.selfRank = undefined;
		this.ranks = undefined;
		
		this.impact_white = new BitmapFont();
		this.fontLoaded = false;
		this.impact_white.loadFont(IMPACT_WHITE_JSON, function () {
			this.fontLoaded = true;
			this.txt = new BitmapText(this.impact_white);
		}.bind(this));
	}
}