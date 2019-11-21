import Sprite from "../base/Sprite.js";
import DataStore from "../data/DataStore.js";
import TouchHandler from "../utils/TouchHandler.js";


export default class MainMenu {
    constructor() {
        DataStore.currentScene = this.toString();

        this.ctx = DataStore.ctx;

        this.branding = new Sprite(
            DataStore.assets.get("branding"),
            0.5 * DataStore.screenWidth,
            0.2 * DataStore.screenHeight,
            0.6 * DataStore.screenWidth
        );

        this.logo = new Sprite(
            DataStore.assets.get("logo"),
            0.5 * DataStore.screenWidth,
            0.5 * DataStore.screenHeight,
            3 * DataStore.bubbleSize,
        );

        // the angle of the logo rotation
        this.logoAngle = 0;

        let mask = wx.createCanvas();
        let maskCtx = mask.getContext("2d");
        maskCtx.fillStyle = "rgba(117, 119, 126, 0.8)";
        maskCtx.fillRect(0, 0, mask.width, mask.height);
        this.mask = new Sprite(
            mask,
            0.5 * DataStore.screenWidth,
            0.5 * DataStore.screenHeight,
            DataStore.screenWidth,
            DataStore.screenHeight
        );

        this.startBtn = new Sprite(
            DataStore.assets.get("start-btn"),
            0.5 * DataStore.screenWidth,
            0.8 * DataStore.screenHeight,
            0.45 * DataStore.screenWidth
        );

        this.rankBtn = new Sprite(
            DataStore.assets.get("rank-btn"),
            0.5 * DataStore.screenWidth,
            0.92 * DataStore.screenHeight,
            0.08 * DataStore.screenWidth
        );

        this.touchHandler = new TouchHandler();
        this.touchHandler.onTouchEnd((e) => {
            if (DataStore.currentScene !== this.toString()) {
                return;
            }

            if (this.startBtn.isTouched(e)) {
                this.touchHandler.destroy();
                cancelAnimationFrame(this.frameID);
                // Game start
                DataStore.MainScene.run();
            }

            if (this.rankBtn.isTouched(e)) {
                DataStore.openDataContext.postMessage({
                    action: "drawRankScene"
                });
                DataStore.lastScene = this.toString();
                DataStore.currentScene = DataStore.RankScene.toString();
            }
        });
    }

    update() {
        this.logoAngle += 0.01;
    }

    render() {
        this.ctx.clearRect(0, 0, DataStore.screenWidth, DataStore.screenHeight);
        this.ctx.fillRect(0, 0, DataStore.screenWidth, DataStore.screenHeight);

        if (DataStore.currentScene === DataStore.RankScene.toString()) {
            DataStore.RankScene.render();
            return;
        }

        // rotate the logo
        this.ctx.save();
        this.ctx.translate(DataStore.screenWidth / 2, DataStore.screenHeight / 2);
        this.ctx.rotate(this.logoAngle);
        this.ctx.translate(-DataStore.screenWidth / 2, -DataStore.screenHeight / 2);
        this.logo.render(this.ctx);
        this.ctx.restore();

        this.mask.render(this.ctx);
        this.branding.render(this.ctx);
        this.startBtn.render(this.ctx);
        this.rankBtn.render(this.ctx);
    }

    // loop all the frames
    run() {
        this.frameID = requestAnimationFrame(this.run.bind(this));
        this.update();
        this.render();
    }

    toString() {
        return "MainMenu";
    }

    static getInstance() {
        if (!MainMenu.instance) {
            MainMenu.instance = new MainMenu();
        }
        return MainMenu.instance;
    }
}