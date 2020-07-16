import DataStore from "../data/DataStore.js";
import Sprite from "../base/Sprite.js";
import Scene from "./Scene.js";
import Grid from "../utils/Grid.js";
import Text from "../utils/Text.js";

export default class RankScene extends Scene {
    constructor() {
        super();
        // background for the leaderboard (top = 15%, height = 65%, mx = 7.5 %, px = 6 %)
        this.leaderboardBackground = new Grid(
            0.15 * DataStore.canvasHeight,
            0.65 * DataStore.canvasHeight,
            0.075 * DataStore.canvasWidth,
            0.06 * DataStore.canvasWidth
        );

        // meta (top = 15%, height = 5%)
        this.header = new Text(
            "每周一凌晨刷新",
            0.015 * DataStore.canvasHeight,
            0.05 * DataStore.canvasHeight
        );

        this.drawLayout();

        // canvas for the leaderboard (top = 20%, height = 60%)
        let leaderboard = wx.createCanvas();
        leaderboard.width = DataStore.canvasWidth - this.leaderboardBackground.mr - this.leaderboardBackground.ml;
        leaderboard.height = DataStore.canvasHeight * 0.6;
        this.leaderboard = new Sprite(
            leaderboard,
            0.5 * DataStore.canvasWidth,
            0.5 * DataStore.canvasHeight,
            leaderboard.width,
            leaderboard.height
        );
    }

    drawLayout() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.ctx.strokeStyle = "rgba(80, 80, 80, 1)";
        this.ctx.lineWidth = 2;
        this.leaderboardBackground.draw(this.ctx);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.header.draw(this.ctx, this.leaderboardBackground.mr + this.leaderboardBackground.pr, this.leaderboardBackground.top + 0.5 * (this.header.lineHeight - this.header.fontSize));

        // hr (top = 20%)
        this.ctx.beginPath();
        this.ctx.moveTo(this.leaderboardBackground.mr, this.leaderboardBackground.top + this.header.lineHeight);
        this.ctx.lineTo(DataStore.canvasWidth - this.leaderboardBackground.ml, this.leaderboardBackground.top + this.header.lineHeight);
        this.ctx.stroke();
    }

    render() {
        this.sprite.render(DataStore.ctx);
    }

    static getInstance() {
        if (!RankScene.instance) {
            RankScene.instance = new RankScene();
        }
        return RankScene.instance;
    }
}