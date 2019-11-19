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

    if (action === "showRankScene") {
        RankScene.getInstance().render();
    }
});

function onAssetsLoaded(assets) {
    let dataStore = DataStore.getInstance();
    dataStore.assets = assets;
}

function init() {
    let dataStore = DataStore.getInstance();

    dataStore.pixelRatio = wx.getSystemInfoSync().pixelRatio;

    let sharedCanvas = wx.getSharedCanvas();

    // Note: the offscreen canvas is not scaled by ctx.scale(). It is crucial for
    // ctx.fillText() to be clear
    dataStore.canvasWidth = sharedCanvas.width;
    dataStore.canvasHeight = sharedCanvas.height;
    dataStore.ctx = sharedCanvas.getContext("2d");

    let mask = wx.createCanvas();
    let maskCtx = mask.getContext("2d");
    maskCtx.beginPath();
    let masklg = maskCtx.createLinearGradient(0, 0, mask.width, mask.height);
    masklg.addColorStop(0, 'rgba(117, 119, 126, 0.8)');
    masklg.addColorStop(1, 'rgba(104, 105, 110, 0.9)');
    maskCtx.fillStyle = masklg;
    maskCtx.fillRect(0, 0, mask.width, mask.height);
    maskCtx.closePath();
    dataStore.mask = new Sprite(
        mask,
        0.5 * dataStore.canvasWidth,
        0.5 * dataStore.canvasHeight,
        dataStore.canvasWidth,
        dataStore.canvasHeight
    );
}
