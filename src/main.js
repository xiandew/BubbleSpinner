// import GameInfo from './runtime/gameInfo';

// let gameInfo = GameInfo.getInstance();

// TODO test assetsLoader, reform gameInfo with the reference of dataStore

import AssetsLoader from "./data/AssetsLoader.js";
import DataStore from "./data/DataStore.js";
import MainMenu from "./scenes/MainMenu.js";

// The entry class of the game
export default class Main {
    constructor() {
        const loader = AssetsLoader.getInstance();
        loader.onLoaded(assets => this.onAssetsLoaded(assets));
        this.dataStore = DataStore.getInstance();
    }

    onAssetsLoaded(assets) {
        this.dataStore.assets = assets;

        // Ref: https://developers.weixin.qq.com/community/develop/doc/0008ecb3280ac8a3c908282cf56401
        // scale the onscreen canvas
        const { screenWidth, screenHeight, pixelRatio } = wx.getSystemInfoSync();
        canvas.width = screenWidth * pixelRatio;
        canvas.height = screenHeight * pixelRatio;

        this.dataStore.screenWidth = screenWidth;
        this.dataStore.screenHeight = screenHeight;
        this.dataStore.ctx = canvas.getContext("2d");
        this.dataStore.ctx.fillStyle = "#ffffff";
        this.dataStore.ctx.scale(pixelRatio, pixelRatio);

        this.dataStore.fps = 60;
        wx.setPreferredFramesPerSecond(this.dataStore.fps);

        // init game data
        this.dataStore.bubbleSize = Math.ceil(0.055 * this.dataStore.screenWidth);
        this.dataStore.score = 0;

        // display MainMenu scene
        new MainMenu();
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