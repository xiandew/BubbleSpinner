import DataStore from "../data/DataStore.js";
import Sprite from "../base/Sprite.js";
import RendererManager from "../renderer/RendererManager.js";
import TouchHandler from "../utils/TouchHandler.js";
import Scene from "./Scene.js";

/**
 * This scene is static (no animation)
 */
export default class GameEnded extends Scene {
    constructor() {
        super();

        let mask = wx.createCanvas();
        let maskCtx = mask.getContext("2d");
        maskCtx.fillStyle = "rgba(30, 30, 30, 0.9)";
        maskCtx.fillRect(0, 0, mask.width, mask.height);
        this.mask = new Sprite(
            mask,
            0.5 * DataStore.screenWidth,
            0.5 * DataStore.screenHeight,
            DataStore.screenWidth,
            DataStore.screenHeight
        );

        this.restartBtn = new Sprite(
            DataStore.assets.get("restart-btn"),
            0.12 * DataStore.screenWidth,
            0.9 * DataStore.screenHeight,
            0.06 * DataStore.screenWidth
        );

        this.touchHandler = new TouchHandler;
        this.touchHandler.onTouchEnd(e => {
            if (DataStore.currentScene !== this.toString()) {
                return;
            }

            if (this.restartBtn.isTouched(e)) {
                DataStore.currentScene = DataStore.lastScene;
            }
        });

        this.rendererManager = new RendererManager();
        this.rendererManager.setRenderer(this.mask);
        this.rendererManager.setRenderer(this.restartBtn);
        this.rendererManager.setRenderer(DataStore.sharedCanvas);
    }

    render() {
        this.rendererManager.render(this.ctx);
    }

    toString() {
        return "RankScene";
    }

    static getInstance() {
        if (!RankScene.instance) {
            RankScene.instance = new RankScene();
        }
        return RankScene.instance;
    }
}