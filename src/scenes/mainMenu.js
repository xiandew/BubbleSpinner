import Sprite from "../base/Sprite.js";
import DataStore from "../data/DataStore.js";
import TouchHandler from "../utils/TouchHandler.js";
import RankScene from "./RankScene.js";


export default class MainMenu {
    constructor() {
        this.dataStore = DataStore.getInstance();
        this.dataStore.currentScene = "MainMenu";

        this.ctx = this.dataStore.ctx;

        this.branding = new Sprite(
            this.dataStore.assets.get("branding"),
            0.5 * this.dataStore.screenWidth,
            0.2 * this.dataStore.screenHeight,
            0.6 * this.dataStore.screenWidth
        );

        this.logo = new Sprite(
            this.dataStore.assets.get("logo"),
            0.5 * this.dataStore.screenWidth,
            0.5 * this.dataStore.screenHeight,
            3 * this.dataStore.bubbleSize,
        );

        // the angle of the logo rotation
        this.logoAngle = 0;

        let mask = wx.createCanvas();
        let maskCtx = mask.getContext("2d");
        maskCtx.fillStyle = "rgba(117, 119, 126, 0.8)";
        maskCtx.fillRect(0, 0, mask.width, mask.height);
        this.mask = new Sprite(
            mask,
            0.5 * this.dataStore.screenWidth,
            0.5 * this.dataStore.screenHeight,
            this.dataStore.screenWidth,
            this.dataStore.screenHeight
        );

        this.startBtn = new Sprite(
            this.dataStore.assets.get("start-btn"),
            0.5 * this.dataStore.screenWidth,
            0.8 * this.dataStore.screenHeight,
            0.45 * this.dataStore.screenWidth
        );

        this.rankBtn = new Sprite(
            this.dataStore.assets.get("rank-btn"),
            0.5 * this.dataStore.screenWidth,
            0.92 * this.dataStore.screenHeight,
            0.08 * this.dataStore.screenWidth
        );

        this.touchHandler = new TouchHandler();
        this.touchHandler.onTouchEnd((e) => {
            if (this.dataStore.currentScene !== "MainMenu") {
                return;
            }

            if (this.startBtn.isTouched(e)) {
                this.touchHandler.destroy();
                cancelAnimationFrame(this.frameID);
                // Game start
            }

            if (this.rankBtn.isTouched(e)) {
                this.dataStore.openDataContext.postMessage({
                    action: "showRankScene"
                });
                this.dataStore.lastScene = "MainMenu";
                this.dataStore.currentScene = "RankScene";
            }
        });

        this.loop();
    }

    update() {
        this.logoAngle += 0.01;
    }

    render() {
        this.ctx.clearRect(0, 0, this.dataStore.screenWidth, this.dataStore.screenHeight);
        this.ctx.fillRect(0, 0, this.dataStore.screenWidth, this.dataStore.screenHeight);

        if (this.dataStore.currentScene === "RankScene") {
            RankScene.getInstance().render();
            return;
        }

        // rotate the logo
        this.ctx.save();
        this.ctx.translate(this.dataStore.screenWidth / 2, this.dataStore.screenHeight / 2);
        this.ctx.rotate(this.logoAngle);
        this.ctx.translate(-this.dataStore.screenWidth / 2, -this.dataStore.screenHeight / 2);
        this.logo.render(this.ctx);
        this.ctx.restore();

        this.mask.render(this.ctx);
        this.branding.render(this.ctx);
        this.startBtn.render(this.ctx);
        this.rankBtn.render(this.ctx);
    }

    // loop all the frames
    loop() {
        this.frameID = requestAnimationFrame(this.loop.bind(this));
        this.update();
        this.render();
    }
}