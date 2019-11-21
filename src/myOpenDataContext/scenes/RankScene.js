import DataStore from "../data/DataStore.js";
import Sprite from "../base/Sprite.js";
import drawRoundRect from "../utils/drawRoundRect.js";

export default class RankScene {
    constructor() {
        // background for the scene
        let bg = wx.createCanvas();
        let bgCtx = bg.getContext("2d");
        bg.width = DataStore.canvasWidth;
        bg.height = DataStore.canvasHeight;
        this.bg = new Sprite(bg, 0.5 * DataStore.canvasWidth, 0.5 * DataStore.canvasHeight, DataStore.canvasWidth, DataStore.canvasHeight);

        // background for the leaderboard (top = 15%, height = 65%)
        let lbTop = 0.15 * bg.height;
        let lbHeight = 0.65 * bg.height;
        // leaderboard margin x = 7.5 %
        let lbmx = 0.075 * bg.width;
        // leaderboard padding x = 6 %
        let lbpx = 0.06 * bg.width;
        bgCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
        bgCtx.strokeStyle = "rgba(80, 80, 80, 1)";
        bgCtx.lineWidth = 2;
        drawRoundRect(bgCtx, lbmx, lbTop, bg.width - 2 * lbmx, lbHeight, 0, true);

        // meta (top = 15%, height = 5%)
        let metaText = "每周一凌晨刷新";
        let metaHeight = 0.05 * bg.height;
        let metaSize = 0.3 * metaHeight;
        bgCtx.fillStyle = "#ffffff";
        bgCtx.font = `${metaSize}px Arial`;
        bgCtx.textAlign = "left";
        bgCtx.textBaseline = "top";
        bgCtx.fillText(metaText, lbmx + lbpx, lbTop + 0.5 * (metaHeight - metaSize));

        // hr (top = 20%)
        bgCtx.beginPath();
        bgCtx.moveTo(lbmx, lbTop + metaHeight);
        bgCtx.lineTo(bg.width - lbmx, lbTop + metaHeight);
        bgCtx.stroke();

        // canvas for the leaderboard (top = 20%, height = 60%)
        let leaderboard = wx.createCanvas();
        leaderboard.width = bg.width - 2 * lbmx;
        leaderboard.height = 0.6 * bg.height;
        this.leaderboard = new Sprite(
            leaderboard,
            0.5 * DataStore.canvasWidth,
            0.5 * DataStore.canvasHeight,
            leaderboard.width,
            leaderboard.height
        );
    }

    render() {
        let ctx = DataStore.ctx;
        DataStore.mask.render(ctx);
        this.bg.render(ctx);
    }

    static getInstance() {
        if (!RankScene.instance) {
            RankScene.instance = new RankScene();
        }
        return RankScene.instance;
    }
}