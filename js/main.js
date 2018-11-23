import Spiral from './spiral';
import Shooter from './shooter';
import GameInfo from './runtime/gameInfo';
import Scene from './runtime/scene';

let isClicked = require('./utilities/isClicked');
let gameInfo = new GameInfo();

let ctx = canvas.getContext('2d');
ctx.imageSmoothingQuality = "high";

// The entry class of the game
export default class Main {
        constructor() {
                this.spiral = new Spiral();
                this.shooter = new Shooter();

                // make sure only add event listener once in 'update'
                this.hasEventBind = true;
                this.addEvents();

                this.spiral.toChange = true;

                this.bindLoop = this.loop.bind(this);
                this.frameID = requestAnimationFrame(this.bindLoop);
        }

        restart() {
		this.spiral.toChange = true;
                this.hasEventBind = false;
        }

        addEvents() {
                !this.touchstarter ? this.touchstarter = this.touchstartHandler.bind(this) : true;
                !this.touchender ? this.touchender = this.touchendHandler.bind(this) : true;
                canvas.addEventListener('touchstart', this.touchstarter);
                canvas.addEventListener('touchend', this.touchender);
        }

        update() {
                if (gameInfo.over) {
                        return;
                }

                this.spiral.update();

		if (!this.spiral.toChange && gameInfo.start) {
                        (!this.shooter.hasEventBind) ? this.shooter.addEvents():
                                this.shooter.update(this.spiral);
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
                        this.shooter.render();
                        Scene.renderGameScore();

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
				
                                //gameInfo.start = false;

                                //this.addEvents();
                                this.hasEventBind = true;

				gameInfo.openDataContext.postMessage({
					cmd: "clearSharedCanvas"
				});

				gameInfo.openDataContext.postMessage({
					cmd: "updateScore",
					score: gameInfo.score
				});
                        }

                        Scene.renderGameOver();
                }

                if (gameInfo.showRank) {
                        Scene.renderRankList();
                }
        }

        touchstartHandler(e) {
                e.preventDefault()

                if (isClicked(e, "RankListReturn")) {
                        gameInfo.showRank = false;
                }

                if (gameInfo.showRank) {
                        return;
                }

                if (isClicked(e, "StartBtn")) {
                        gameInfo.reset();
                        canvas.removeEventListener('touchstart', this.touchstarter);
                }

                if (isClicked(e, "RankListIcon")) {
                        gameInfo.showRank = true;
                        gameInfo.openDataContext.postMessage({
                                cmd: "showRankList"
                        });
                }
        }

        touchendHandler(e) {
                e.preventDefault();
                if (!gameInfo.over) {
                        this.restart();

                        this.frameID ? cancelAnimationFrame(this.frameID) : true;
                        this.frameID = requestAnimationFrame(this.bindLoop);

                        canvas.removeEventListener('touchend', this.touchender);
                }
        }

        // loop all the frames
        loop() {
                this.update();
                this.render();

                this.frameID = requestAnimationFrame(this.bindLoop);
        }
}