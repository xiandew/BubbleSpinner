import AssetsLoader from "./src/data/AssetsLoader.js";
import DataStore from "./src/data/DataStore.js";
import RankScene from "./src/scenes/RankScene.js";
import GameEnded from "./src/scenes/GameEnded.js";

wx.onMessage(function (msg) {
    let action = msg.action;

    if (action === "LoadAssets") {
        AssetsLoader.getInstance().onLoaded(assets => onAssetsLoaded(assets));
    }

    if (action === "RankScene") {
        if (DataStore.assets) DataStore.RankScene.render();
        DataStore.currentScene = RankScene.toString();
    }

    if (action === "GameEnded") {
        DataStore.GameEnded.render();
    }

    if (action === "MainMenu") {
        DataStore.currentScene = "MainMenu";
    }
});

function onAssetsLoaded(assets) {
    DataStore.assets = assets;


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


    if (DataStore.currentScene === RankScene.toString()) DataStore.RankScene.render();
}