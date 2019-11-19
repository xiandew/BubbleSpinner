import DataStore from "../data/DataStore.js";
import Sprite from "../base/Sprite.js";
import roundRect from "../utils/roundRect.js";

export default class RankScene {
    constructor() {
        this.dataStore = DataStore.getInstance();

        let bg = wx.createCanvas();
        let bgCtx = bg.getContext("2d");
        bg.width = this.dataStore.canvasWidth;
        bg.height = this.dataStore.canvasHeight;
        this.bg = new Sprite(bg, 0.5 * this.dataStore.canvasWidth, 0.5 * this.dataStore.canvasHeight, this.dataStore.canvasWidth, this.dataStore.canvasHeight);

        let headerText = "好友排行榜";
        let headerStartY = 0.125 * bg.height;
        let headerSize = 0.03 * bg.height;

        bgCtx.fillStyle = "#ffffff";
        bgCtx.font = `bold ${headerSize}px Arial`;
        bgCtx.textAlign = "center";
        bgCtx.fillText(headerText, 0.5 * bg.width, headerStartY);

        // mainPanel for meta and leaderboard
        // mainPanel start y = 17%
        // mainPanel end y = 70%
        bgCtx.fillStyle = "#3c3c3c";
        bgCtx.strokeStyle = "#000000";
        bgCtx.lineWidth = 1;
        let mainPanelStartX = 0.075 * bg.width;
        let mainPanelStartY = 0.17 * bg.height;
        let mainPanelWidth = 0.85 * bg.width;
        let mainPanelHeight = 0.53 * bg.height;
        roundRect(bgCtx, mainPanelStartX, mainPanelStartY, mainPanelWidth, mainPanelHeight, 8, true);

        // meta start y = 17%
        // meta height = 3%
        let metaText = "每周一凌晨刷新";
        let metaLineHeight = 0.03 * bg.height;
        let metaSize = 0.5 * metaLineHeight;
        bgCtx.fillStyle = "#9b9b9b";
        bgCtx.font = `${metaSize}px Arial`;
        bgCtx.textAlign = "left";
        bgCtx.textBaseline = "top";
        bgCtx.fillText(
            metaText,
            mainPanelStartX + 0.07 * mainPanelWidth,
            mainPanelStartY + 0.5 * (metaLineHeight - metaSize)
        );

        // leaderboard start y = 20%
        // leaderboard height = 50%
        let leaderboard = wx.createCanvas();
        leaderboard.width = mainPanelWidth;
        leaderboard.height = 0.5 * bg.height;
        this.leaderboard = new Sprite(
            leaderboard,
            0.5 * this.dataStore.canvasWidth,
            0.35 * this.dataStore.canvasHeight,
            leaderboard.width,
            leaderboard.height
        );

        // myPanel for my rank
        // myPanel start y = 72.5%
        // myPanel height = 12.5%
        bgCtx.fillStyle = "#3f3f3f";
        bgCtx.strokeStyle = "#bbbbbb";
        bgCtx.lineWidth = 1;
        roundRect(bgCtx, 0.075 * bg.width, 0.725 * bg.height, 0.85 * bg.width, 0.125 * bg.height, 8, true);
    }

    render() {
        let ctx = this.dataStore.ctx;
        this.dataStore.mask.render(ctx);
        this.bg.render(ctx);
    }

    static getInstance() {
        if (!RankScene.instance) {
            RankScene.instance = new RankScene();
        }
        return RankScene.instance;
    }
}