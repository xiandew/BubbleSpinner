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
	}
}