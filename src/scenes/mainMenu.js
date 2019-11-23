import Sprite from "../base/Sprite.js";
import DataStore from "../data/DataStore.js";
import TouchHandler from "../utils/TouchHandler.js";
import AnimatorController from "../animation/AnimatorController.js";
import Scene from "./Scene.js";

export default class MainMenu extends Scene {
    constructor() {
        super();

        DataStore.currentScene = this.toString();

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
        AnimatorController.registerAnimator(this.logo, "Rotate");

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
                AnimatorController.registerAnimator(this.logo, "RotateOut");
                AnimatorController.registerAnimator(this.mask, "FadeOut");
                this.exit();
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

    render() {
        super.render();

        if (DataStore.currentScene === DataStore.RankScene.toString()) {
            DataStore.RankScene.render();
            return;
        }

        this.logo.animator.animate(this.ctx);
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

    exit() {
        this.frameID = requestAnimationFrame(this.exit.bind(this));

        super.render();
        this.logo.animator.animate(this.ctx);
        this.mask.animator.animate(this.ctx);

        if (this.mask.animator.animationComplete &&
            this.logo.animator.animationComplete) {

            cancelAnimationFrame(this.frameID);
            DataStore.MainScene.enter();
        }
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