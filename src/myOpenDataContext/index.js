// import BitmapFont from "./utils/BitmapFont.js";
// import BitmapText from "./utils/BitmapText.js";

import AssetsLoader from "./data/AssetsLoader.js";
import DataStore from "./data/DataStore.js";
import Sprite from "./base/Sprite.js";
import RankScene from "./scenes/RankScene.js";

wx.onMessage(msg => {
    let action = msg.action;

    if (action === "init") {
        const loader = AssetsLoader.getInstance();
        loader.onLoaded(assets => onAssetsLoaded(assets));

        init();
    }

    if (action === "drawRankScene") {
        DataStore.RankScene.render();
    }
});

function onAssetsLoaded(assets) {
    DataStore.assets = assets;
}

function init() {

    DataStore.pixelRatio = wx.getSystemInfoSync().pixelRatio;

    let sharedCanvas = wx.getSharedCanvas();

    // Note: the offscreen canvas is not scaled by ctx.scale(). It is crucial for
    // ctx.fillText() to be clear
    DataStore.canvasWidth = sharedCanvas.width;
    DataStore.canvasHeight = sharedCanvas.height;
    DataStore.ctx = sharedCanvas.getContext("2d");

    let mask = wx.createCanvas();
    let maskCtx = mask.getContext("2d");
    maskCtx.beginPath();
    maskCtx.fillStyle = "rgba(30, 30, 30, 0.9)";
    maskCtx.fillRect(0, 0, mask.width, mask.height);
    maskCtx.closePath();
    DataStore.mask = new Sprite(
        mask,
        0.5 * DataStore.canvasWidth,
        0.5 * DataStore.canvasHeight,
        DataStore.canvasWidth,
        DataStore.canvasHeight
    );

    DataStore.RankScene = RankScene.getInstance();
}
