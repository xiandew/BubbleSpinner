// Usage: js/main.js

import {
        START_BUTTON,
        RANK_LIST_ICON
} from '../runtime/scene';
import GameInfo from '../runtime/gameInfo';
let gameInfo = GameInfo.getInstance();

/*----------------------------------------------------------------------------*/

const btnAreas = {
        "StartButton": START_BUTTON.area,
        "RankListIcon": RANK_LIST_ICON.area,
        "RankListReturn": {
                startX: 0.08 * gameInfo.canvasWidth,
                startY: 0.9 * gameInfo.canvasHeight,
                endX: 0.16 * gameInfo.canvasWidth,
                endY: 0.98 * gameInfo.canvasHeight
        },
        "RestartButton": {
                startX: 0.2679 * gameInfo.canvasWidth,
                endX: 0.7321 * gameInfo.canvasWidth,
                startY: 0.75 * gameInfo.canvasHeight - 0.07 * gameInfo.canvasWidth,
                endY: 0.75 * gameInfo.canvasHeight + 0.07 * gameInfo.canvasWidth
        },
        "FullRankList": {
                startX: 0.642 * gameInfo.canvasWidth,
                startY: 0.525 * gameInfo.canvasHeight,
                endX: 0.925 * gameInfo.canvasWidth,
                endY: 0.56875 * gameInfo.canvasHeight
        },
        "GroupRankList": {
                startX: 0.544 * gameInfo.canvasWidth,
                endX: 0.912 * gameInfo.canvasWidth,
                startY: 0.923 * gameInfo.canvasHeight - 0.056 * gameInfo.canvasWidth,
                endY: 0.923 * gameInfo.canvasHeight + 0.056 * gameInfo.canvasWidth
        }
}

/*----------------------------------------------------------------------------*/

let thiscallback;

module.exports = {
        addEvents: function(callback) {
                thiscallback = callback;
                canvas.addEventListener('touchstart', touchstartHandler);
                canvas.addEventListener('touchend', touchendHandler);
        },
        removeEvents: function() {
                canvas.removeEventListener('touchstart', touchstartHandler);
                canvas.removeEventListener('touchend', touchendHandler);
        }
}

function isTouchedOn(e, btn) {
        let x = (e.touches[0] || e.changedTouches[0]).clientX;
        let y = (e.touches[0] || e.changedTouches[0]).clientY;
        let area = btnAreas[btn];
        return x >= area.startX && x <= area.endX && y >= area.startY && y <= area.endY;
}

let touchstart = {};

function touchstartHandler(e) {
        for (let btn in btnAreas) {
                if (isTouchedOn(e, btn)) {
                        touchstart[btn] = true;
                }
        }
}

function touchendHandler(e) {
        for (let btn in btnAreas) {
                if (touchstart[btn] && isTouchedOn(e, btn)) {
                        thiscallback(btn);
                }
                touchstart[btn] = false;
        }
}