import GameInfo from './gameInfo';
import Spiral from '../spiral';
import Hole from '../hole';
import BitmapFont from "../utilities/bitmapFont";
import BitmapText from "../utilities/bitmapText";

let btnArea = require('../utilities/buttonArea');
let newImage = require('../utilities/newImage');

/*----------------------------------------------------------------------------*/

let impact_black = new BitmapFont();
let fontLoaded = false;
impact_black.loadFont('fonts/impact_black.json', function() {
        fontLoaded = true
});

const SCORE_H = 0.075 * canvas.width;
const SCORE_X = 0.055 * canvas.width;
const SCORE_Y = 0.165 * canvas.width;

const LARGE_SCORE_Y = 0.55 * canvas.height;
const LARGE_SCORE_H = 0.15 * canvas.width;

const HIT_PEAS = {
        img: newImage('images/HitPeas.png'),
        x: 0.5 * canvas.width,
        y: 0.2 * canvas.height,
        w: 0.6 * canvas.width,
}
HIT_PEAS.h = HIT_PEAS.w / 5;

export const START_BTN = {
        img: newImage('images/startGame.png'),
        x: 0.5 * canvas.width,
        y: 0.8 * canvas.height,
        h: 0.05 * canvas.width,
        bgColour: "#ffffff"
};
START_BTN.w = (305 / 60) * START_BTN.h;
START_BTN.area = btnArea(START_BTN);

export const RESTART_BTN = {
        img: newImage('images/restartGame.png'),
        x: 0.5 * canvas.width,
        y: 0.8 * canvas.height,
        h: 0.06 * canvas.width,
        bgColour: "#ffffff"
};
RESTART_BTN.w = (305 / 60) * RESTART_BTN.h,
        RESTART_BTN.area = btnArea(RESTART_BTN);

export const RANK_LIST_ICON = {
        img: newImage('images/rankListIcon.png'),
        x: 0.5 * canvas.width,
        y: 0.92 * canvas.height,
        h: 0.08 * canvas.width,
};
RANK_LIST_ICON.w = RANK_LIST_ICON.h;
RANK_LIST_ICON.area = btnArea(RANK_LIST_ICON, true);

export const RANK_LIST_RETURN = {
        img: newImage('images/return.png'),
        x: 0.12 * canvas.width,
        y: 0.92 * canvas.height,
        h: 0.08 * canvas.width
}
RANK_LIST_RETURN.w = RANK_LIST_RETURN.h;
RANK_LIST_RETURN.area = btnArea(RANK_LIST_RETURN, true);

/*----------------------------------------------------------------------------*/

let ctx = canvas.getContext('2d');

let gameInfo = new GameInfo();
let animeAngle = 0;
let spiralFullSize = false;

// an accumulator for show-up animation
let acc = 0;

// for rendering score
let txt;

/*----------------------------------------------------------------------------*/

export default class Scene {
        constructor() {

        }
        static renderGameStart(spiral) {
                animeAngle += 0.01;
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(animeAngle);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
                spiral.render();
                ctx.restore();

                ctx.beginPath();
                ctx.fillStyle = "rgba(117, 119, 126, 0.8)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.closePath();

                Scene.draw(HIT_PEAS);
                Scene.drawButton(START_BTN);
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
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(scale, scale);
                ctx.rotate(Math.PI * 2 * scale);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);

                spiral.render();
                ctx.restore();
        }

        static renderRankList() {
                ctx.drawImage(gameInfo.sharedCanvas, 0, 0, canvas.width, canvas.height);
                Scene.draw(RANK_LIST_RETURN);
        }

        static renderGameOver() {
                ctx.drawImage(gameInfo.sharedCanvas, 0, 0, canvas.width, canvas.height);
                //this.addEvents();
        }

        static renderGameScore() {
                if (fontLoaded) {
                        if (!txt) {
                                txt = new BitmapText(impact_black);
                        }
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

        fadeOut() {

        }
}