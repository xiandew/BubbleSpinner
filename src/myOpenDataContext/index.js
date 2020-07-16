import AssetsLoader from "./src/data/AssetsLoader.js";
import DataStore from "./src/data/DataStore.js";
import Sprite from "./src/base/Sprite.js";
import RankScene from "./src/scenes/RankScene.js";
import GameEnded from "./src/scenes/GameEnded.js";
import Scene from "./src/scenes/Scene.js";

wx.onMessage(msg => {
    let action = msg.action;

    if (action === "init") {
        const loader = AssetsLoader.getInstance();
        loader.onLoaded(assets => onAssetsLoaded(assets));

        init();
    }

    if (action === "RankScene") {
        DataStore.RankScene.render();
    }

    if (action === "GameEnded") {
        DataStore.GameEnded.render();
    }
});

function onAssetsLoaded(assets) {
    DataStore.assets = assets;
}

function init() {
    let sharedCanvas = wx.getSharedCanvas();

    DataStore.pixelRatio = wx.getSystemInfoSync().pixelRatio;
    // Note: the offscreen canvas is not scaled by ctx.scale(). It is crucial to draw all
    // the sprites as proportional to the canvas that has already been scaled up for
    // ctx.fillText() to be clear
    DataStore.canvasWidth = sharedCanvas.width;
    DataStore.canvasHeight = sharedCanvas.height;
    DataStore.ctx = sharedCanvas.getContext("2d");

    DataStore.RankScene = RankScene.getInstance();
    DataStore.GameEnded = GameEnded.getInstance();
}
