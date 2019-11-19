import DataStore from "../data/DataStore.js";
import Sprite from "../base/Sprite.js";
import TouchHandler from "../utils/TouchHandler.js";

/**
 * This scene is static (no animation). It composes of two parts. One part is
 * the sharedCanvas, the other is the return btn and the group rank btn. The
 * reason not to draw the btns on the sharedCanvas is as following:
 *   - Their events are bound in the primary domain;
 *   - The assets are garanteed to be loaded in the primary domain so the
 *     return btn can be shown immediately in concern of ux.
 */

export default class RankScene {
    constructor() {
        this.dataStore = DataStore.getInstance();
        this.ctx = this.dataStore.ctx;
        this.returnBtn = new Sprite(
            this.dataStore.assets.get("return-btn"),
            0.115 * this.dataStore.screenWidth,
            0.92 * this.dataStore.screenHeight,
            0.08 * this.dataStore.screenWidth
        );
        this.groupRankBtn = new Sprite(
            this.dataStore.assets.get("group-rank-btn"),
            0.728 * this.dataStore.screenWidth,
            0.92 * this.dataStore.screenHeight,
            0.35 * this.dataStore.screenWidth
        );

        this.touchHandler = new TouchHandler;
        this.touchHandler.onTouchEnd(e => {
            // TODO
        });
    }

    render() {
        this.dataStore.sharedCanvas.render(this.ctx);
        this.returnBtn.render(this.ctx);
        this.groupRankBtn.render(this.ctx);
    }

    static getInstance() {
        if (!RankScene.instance) {
            RankScene.instance = new RankScene();
        }
        return RankScene.instance;
    }
}