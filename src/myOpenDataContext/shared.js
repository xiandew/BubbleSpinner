import IMPACT_WHITE_JSON from './fonts/impact_white';
import BitmapFont from "./utilities/bitmapFont";
import BitmapText from "./utilities/bitmapText";

let instance;

// Used to share the common information for modules,
// for drawing ranks first if they are defined and updating
// later when getting new info.
export default class Shared {
        constructor() {
                if (instance) {
                        return instance;
                }
                instance = this;

                let sharedCanvas = wx.getSharedCanvas();
                this.ctx = sharedCanvas.getContext('2d');

                // Draw on the shared canvas with respect to width of 750.
                this.canvasWidth = 750;
                this.canvasHeight = this.canvasWidth * sharedCanvas.height / sharedCanvas.width;

                this.scale = sharedCanvas.width / this.canvasWidth;
                this.ctx.scale(this.scale, this.scale);

                this.selfRankIndex = undefined;
                this.selfRank = undefined;
                // record friend ranks but not group ranks
                this.ranks = undefined;

                // when the fullRankList is allowed to be drawn on the shared canvas
                this.asyncAllowed = true;

                this.fontLoaded = false;
                let impact_white = new BitmapFont();
                impact_white.loadFont(IMPACT_WHITE_JSON, function() {
                        this.fontLoaded = true;
                        this.txt = new BitmapText(impact_white);
                }.bind(this));
        }
}