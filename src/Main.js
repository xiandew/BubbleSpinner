import AssetsLoader from "./data/AssetsLoader.js";
import DataStore from "./data/DataStore.js";
import Sprite from "./base/Sprite.js";

import MainMenu from "./scenes/MainMenu.js";
import MainScene from "./scenes/MainScene.js";
import RankScene from "./scenes/RankScene.js";

// The entry class of the game
export default class Main {
    constructor() {
        const loader = AssetsLoader.getInstance();
        loader.onLoaded(assets => this.onAssetsLoaded(assets));
    }

    onAssetsLoaded(assets) {
        DataStore.assets = assets;

        // Ref: https://developers.weixin.qq.com/community/develop/doc/0008ecb3280ac8a3c908282cf56401
        // scale the onscreen canvas
        const { screenWidth, screenHeight, pixelRatio } = wx.getSystemInfoSync();
        canvas.width = screenWidth * pixelRatio;
        canvas.height = screenHeight * pixelRatio;

        DataStore.screenWidth = screenWidth;
        DataStore.screenHeight = screenHeight;
        DataStore.pixelRatio = pixelRatio;
        DataStore.ctx = canvas.getContext("2d");
        DataStore.ctx.fillStyle = "#ffffff";
        DataStore.ctx.scale(pixelRatio, pixelRatio);

        // setup the offscreen canvas for the ranking
        let openDataContext = wx.getOpenDataContext();
        let sharedCanvas = openDataContext.canvas;
        sharedCanvas.width = canvas.width;
        sharedCanvas.height = canvas.height;
        DataStore.sharedCanvas = new Sprite(
            sharedCanvas,
            0.5 * screenWidth,
            0.5 * screenHeight,
            screenWidth,
            screenHeight
        );
        DataStore.openDataContext = openDataContext;
		DataStore.openDataContext.postMessage({
			action: "init"
        });

        DataStore.fps = 60;
        wx.setPreferredFramesPerSecond(DataStore.fps);

        // init shared (used in more than one scenes) game data
        DataStore.score = 0;
        DataStore.level = 0;

        // init scenes
        DataStore.MainMenu = MainMenu.getInstance();
        DataStore.MainScene = MainScene.getInstance();
        DataStore.RankScene = RankScene.getInstance();

        // start MainMenu scene
        DataStore.MainMenu.run();
    }
}

wx.showShareMenu({
    withShareTicket: true,
});

wx.onShareAppMessage(function() {
    return {
        title: '即刻畅玩，战豆到底！',
        imageUrl: DataStore.getInstance().assets.get("share-img").src
    }
});

// show group rank
wx.onShow(res => {
    let shareTicket = res.shareTicket;
    if (shareTicket) {
        gameInfo.showRank = true;

        // for muting the showGroupRank button
        gameInfo.showGroupRank = true;

        gameInfo.openDataContext.postMessage({
            cmd: "clearSharedCanvas"
        });
        gameInfo.openDataContext.postMessage({
            cmd: "groupRankList",
            ticket: shareTicket
        });
    }
});
