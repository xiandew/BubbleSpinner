import GameInfo from './runtime/gameInfo';
import Scene from './runtime/scene';
import ExtraBalls from "./runtime/extraBalls";

import Lives from "./lives";
import Spiral from './spiral';
import Shooter from './shooter';
let click = require('./utilities/click');

let gameInfo = GameInfo.getInstance();
let ctx = canvas.getContext('2d');
ctx.fillStyle = "#ffffff";

/*----------------------------------------------------------------------------*/

// The entry class of the game
export default class Main {
        constructor() {
                this.spiral = new Spiral();
                this.shooter = new Shooter();
                this.lives = new Lives();
                this.extra = new ExtraBalls();

                // make sure only add event listener once in 'update'
                this.hasEventBind = true;
                this.bindCallback = this.callback.bind(this);
                click.addEvents(this.bindCallback);

                this.spiral.toChange = true;

                this.bindLoop = this.loop.bind(this);
                this.frameID = requestAnimationFrame(this.bindLoop);
        }

        restart() {
                this.spiral.toChange = true;
                this.hasEventBind = false;
        }

        update() {
                if (gameInfo.over) {
                        return;
                }

                this.spiral.update();
                this.extra.update(this.spiral);

                if (!this.spiral.toChange && gameInfo.start) {
                        if (!this.shooter.hasEventBind) {
                                this.shooter.addEvents()
                        } else {
                                this.shooter.update(this.spiral)
                        }
                }

                if (gameInfo.levelup) {
                        this.restart();
                        gameInfo.levelup = false;
                }
        }

        render() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                if (!gameInfo.start) {
                        Scene.renderGameStart(this.spiral);
                }

                if (gameInfo.start) {
                        Scene.renderGameScore();

                        this.shooter.render();
                        this.lives.render();
                        this.extra.render();

                        if (this.spiral.toChange) {
                                Scene.changeSpiralAnime(this.spiral);
                                return;
                        } else {
                                this.spiral.render();
                        }
                }

                if (gameInfo.over) {
                        if (!this.hasEventBind) {
                                this.shooter.removeEvents();

                                gameInfo.openDataContext.postMessage({
                                        cmd: "clearSharedCanvas"
                                });

                                gameInfo.openDataContext.postMessage({
                                        cmd: "updateScore",
                                        score: gameInfo.score
                                });

                                this.hasEventBind = true;
                                click.addEvents(this.bindCallback);
                        }
                        Scene.renderGameOver();
                }
        }

        // loop all the frames
        loop() {
                this.update();
                this.render();

                this.frameID = requestAnimationFrame(this.bindLoop);
        }

        // click event callback
        callback(btn) {
                switch (btn) {
                        case "RankListReturn":
                                if (!gameInfo.showRank) {
                                        return;
                                }

                                gameInfo.showRank = false;
                                gameInfo.showGroupRank = false;
                                break;
                        case "GroupRankList":
                                if (!gameInfo.showRank || gameInfo.showGroupRank) {
                                        return;
                                }

                                wx.shareAppMessage({
                                        title: "查看群排行",
                                        imageUrl: "images/share/rankListIcon.png"
                                });
                                break;
                        case "StartButton":
                                if (gameInfo.start || gameInfo.showRank) {
                                        return;
                                }

                                gameInfo.reset();

                                this.hasEventBind = false;
                                click.removeEvents();
                                break;
                        case "RankListIcon":
                                if (gameInfo.start || gameInfo.showRank) {
                                        return;
                                }

                                gameInfo.showRank = true;
                                gameInfo.openDataContext.postMessage({
                                        cmd: "showRankList"
                                });
                                break;
                        case "FullRankList":
                                if (!gameInfo.start || !gameInfo.over) {
                                        return;
                                }

                                gameInfo.showRank = true;
                                break;
                        case "RestartButton":
                                if (!gameInfo.start || !gameInfo.over || gameInfo.showRank) {
                                        return;
                                }

                                gameInfo.reset();

                                this.shooter.initShooter();
                                this.spiral.toChange = true;

                                this.hasEventBind = false;
                                click.removeEvents();
                                break;
                }
        }
}

const SHARE_IMG = [
	'images/share/b_blue.png',
	'images/share/b_cyan.png',
	'images/share/b_green.png',
	'images/share/b_pink.png',
	'images/share/b_red.png',
	'images/share/b_yellow.png'
];

wx.showShareMenu({
        withShareTicket: true,
});

wx.onShareAppMessage(function() {
        return {
                title: '咻咻咻',
                imageUrl: SHARE_IMG[Math.floor(Math.random() * SHARE_IMG.length)]
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
