// Usage: js/main.js

import {
        START_BUTTON,
        RANK_LIST_ICON
} from '../runtime/scene';

/*----------------------------------------------------------------------------*/

const btnAreas = {
        "StartButton": START_BUTTON.area,
        "RankListIcon": RANK_LIST_ICON.area,
        "RankListReturn": {
                startX: 0.08 * canvas.width,
                startY: 0.9 * canvas.height,
                endX: 0.16 * canvas.width,
                endY: 0.98 * canvas.height
        },
        "RestartButton": {
                startX: 0.2679 * canvas.width,
                endX: 0.7321 * canvas.width,
                startY: 0.75 * canvas.height - 0.07 * canvas.width,
                endY: 0.75 * canvas.height + 0.07 * canvas.width
        },
        "FullRankList": {
                startX: 0.642 * canvas.width,
                startY: 0.525 * canvas.height,
                endX: 0.925 * canvas.width,
                endY: 0.56875 * canvas.height
        },
        "GroupRankList": {
                startX: 0.544 * canvas.width,
                endX: 0.912 * canvas.width,
                startY: 0.923 * canvas.height - 0.056 * canvas.width,
                endY: 0.923 * canvas.height + 0.056 * canvas.width
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
                        touchstart[btn] = false;
                        return thiscallback(btn);
                }
        }
}