import GameInfo, {
        SHARE_IMG
} from './runtime/gameInfo';
import Scene from './runtime/scene';
import ExtraBalls from "./runtime/extraBalls";

import Lives from "./lives";
import Spiral from './spiral';
import Shooter from './shooter';

let gameInfo = new GameInfo();
let ctx = canvas.getContext('2d');
ctx.imageSmoothingQuality = "high";

let touch = require('./utilities/touch');

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
                touch.addEvents(this.bindCallback);

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

                gameInfo.levelup ? (this.restart(), gameInfo.levelup = false) : true;

        }

        render() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#ffffff";
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
                                this.shooter.initShooter();
                                this.shooter.removeEvents();

                                gameInfo.openDataContext.postMessage({
                                        cmd: "clearSharedCanvas"
                                });

                                gameInfo.openDataContext.postMessage({
                                        cmd: "updateScore",
                                        score: gameInfo.score
                                });

                                this.hasEventBind = true;
                                touch.addEvents(this.bindCallback);
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

        // touch event callback
        callback(btn) {
                switch (btn) {
                        case "RankListReturn":
                                if (!gameInfo.showRank) {
                                        return;
                                }

                                gameInfo.showRank = false;
                                break;
                        case "GroupRankList":
                                if (!gameInfo.showRank) {
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
                                touch.removeEvents();
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

                                // cannot change the status of the spiral later in touchendHandler
                                // since the non-stopping loop will execute update first instead of
                                // touchendHandler.
                                this.spiral.toChange = true;

                                this.hasEventBind = false;
                                touch.removeEvents();
                                break;
                }
        }
}

wx.showShareMenu({
        withShareTicket: true,
});

wx.onShareAppMessage(function() {
        return {
                title: 'Shoot it!!',
                imageUrl: SHARE_IMG[Math.floor(Math.random() * SHARE_IMG.length)]
        }
});

wx.onShow(res => {
	let shareTicket = res.shareTicket;
	if (shareTicket) {
		gameInfo.openDataContext.postMessage({
			cmd: "groupRankList", 
			ticket: shareTicket
		});
	}
});