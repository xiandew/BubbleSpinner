import GameInfo from './gameInfo';
import Spiral from '../spiral';
import Hole from '../hole';

import IMPACT_BLACK_JSON from '../../fonts/impact_black';
import BitmapFont from "../utilities/bitmapFont";
import BitmapText from "../utilities/bitmapText";

let btnArea = require('../utilities/buttonArea');
let newImage = require('../utilities/newImage');
let gameInfo = new GameInfo();
/*----------------------------------------------------------------------------*/

let impact_black = new BitmapFont();
let fontLoaded = false;
let txt;
impact_black.loadFont(IMPACT_BLACK_JSON, function() {
        fontLoaded = true;
        txt = new BitmapText(impact_black);
});

const SCORE_H = 0.075 * gameInfo.canvasWidth;
const SCORE_X = 0.055 * gameInfo.canvasWidth;
const SCORE_Y = 0.165 * gameInfo.canvasWidth;

const LARGE_SCORE_Y = 0.55 * gameInfo.canvasHeight;
const LARGE_SCORE_H = 0.15 * gameInfo.canvasWidth;

const HIT_PEAS = {
        img: newImage('images/HitPeas.png'),
        x: 0.5 * gameInfo.canvasWidth,
        y: 0.2 * gameInfo.canvasHeight,
        w: 0.6 * gameInfo.canvasWidth,
}
HIT_PEAS.h = HIT_PEAS.w / 5;

export const START_BUTTON = {
        img: newImage('images/startGame.png'),
        x: 0.5 * gameInfo.canvasWidth,
        y: 0.8 * gameInfo.canvasHeight,
        h: 0.05 * gameInfo.canvasWidth,
        bgColour: "#ffffff"
};
START_BUTTON.w = (305 / 60) * START_BUTTON.h;
START_BUTTON.area = btnArea(START_BUTTON);

export const RANK_LIST_ICON = {
        img: newImage('images/rankListIcon.png'),
        x: 0.5 * gameInfo.canvasWidth,
        y: 0.92 * gameInfo.canvasHeight,
        h: 0.08 * gameInfo.canvasWidth,
};
RANK_LIST_ICON.w = RANK_LIST_ICON.h;
RANK_LIST_ICON.area = btnArea(RANK_LIST_ICON, true);

/*----------------------------------------------------------------------------*/

let ctx = canvas.getContext('2d');
let animeAngle = 0;
let spiralFullSize = false;

// an accumulator for show-up animation
let acc = 0;

/*----------------------------------------------------------------------------*/

export default class Scene {
        constructor() {

        }
        static renderGameStart(spiral) {
                if (gameInfo.showRank) {
                        Scene.renderRankList();
                        return;
                }

                animeAngle += 0.01;
                ctx.save();
		ctx.translate(
			gameInfo.canvasWidth / 2,
			gameInfo.canvasHeight / 2
		);
                ctx.rotate(animeAngle);
                ctx.translate(
			-gameInfo.canvasWidth / 2,
			-gameInfo.canvasHeight / 2
		);
                spiral.render();
                ctx.restore();

                ctx.beginPath();
                ctx.fillStyle = "rgba(117, 119, 126, 0.8)";
                ctx.fillRect(0, 0, gameInfo.canvasWidth, gameInfo.canvasHeight);
                ctx.closePath();

                Scene.draw(HIT_PEAS);
                Scene.drawButton(START_BUTTON);
                Scene.draw(RANK_LIST_ICON);
        }

        static changeSpiralAnime(spiral) {
                if (!spiralFullSize) {
                        acc += 0.02;
                        // when the spiral gets to scale of 1
                        if (acc > Math.PI / 2) {
                                acc = Math.PI / 2;
                                spiral.toChange = false;
                                spiralFullSize = true;
                        }
                } else {
                        acc -= 0.02;
                        // when the spiral gets to scale of 0
                        if (acc < 0) {
                                acc = 0;
                                spiral.initBalls();
                                spiralFullSize = false;
                        }
                }
                let scale = Math.sin(acc);

                ctx.save();
                ctx.translate(gameInfo.canvasWidth / 2, gameInfo.canvasHeight / 2);
                ctx.scale(scale, scale);
                ctx.rotate(Math.PI * 2 * scale);
                ctx.translate(-gameInfo.canvasWidth / 2, -gameInfo.canvasHeight / 2);

                spiral.render();
                ctx.restore();
        }

        static renderRankList() {
		ctx.drawImage(
			gameInfo.sharedCanvas,
			0,
			0,
			canvas.width  * (canvas.width / 750),
			canvas.height * (canvas.width / 750)
		);
        }

        static renderGameOver() {
                ctx.drawImage(
			gameInfo.sharedCanvas,
			0,
			0,
			canvas.width * (canvas.width / 750),
			canvas.height * (canvas.width / 750)
		);
        }

        static renderGameScore() {
                if (fontLoaded) {
                        txt.fontSize = SCORE_H;
                        txt.draw(ctx, gameInfo.score, SCORE_X, SCORE_Y);
                }
        }

        static drawButton(btn) {
                Scene.drawRoundRect(btn.area, btn.bgColour);
                Scene.draw(btn);
        }

        static draw(obj) {
                ctx.beginPath();
                ctx.drawImage(
                        obj.img,
                        obj.x - obj.w / 2,
                        obj.y - obj.h / 2,
                        obj.w,
                        obj.h
                );
                ctx.closePath();
        }

        static drawRoundRect(area, bgColour) {
                let x = area.startX;
                let y = area.startY;
                let w = area.w;
                let h = area.h;
                let r = area.h / 2;

                if (w < 2 * r) {
                        r = w / 2;
                }
                if (h < 2 * r) {
                        r = h / 2;
                }
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);

                ctx.fillStyle = bgColour;
                ctx.fill();
                ctx.closePath();
        }
}