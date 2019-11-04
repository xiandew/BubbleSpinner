// Usage: js/myOpenDataContext/utilities/drawRankListThumbnail.js

import Shared from "../shared";
let shared = new Shared();
let canvasWidth = wx.getSystemInfoSync().screenWidth;
let canvasHeight = wx.getSystemInfoSync().screenHeight;

/*----------------------------------------------------------------------------*/

const btnAreas = {
        "RankListReturn": {
                startX: 0.08 * canvasWidth,
                startY: 0.9 * canvasHeight,
                endX: 0.16 * canvasWidth,
                endY: 0.98 * canvasHeight
        },
        "FullRankList": {
                startX: 0.642 * canvasWidth,
                startY: 0.525 * canvasHeight,
                endX: 0.925 * canvasWidth,
                endY: 0.56875 * canvasHeight
        },
        "RestartButton": {
                startX: 0.2679 * canvasWidth,
                endX: 0.7321 * canvasWidth,
                startY: 0.75 * canvasHeight - 0.07 * canvasWidth,
                endY: 0.75 * canvasHeight + 0.07 * canvasWidth
        }
};

/*----------------------------------------------------------------------------*/

module.exports = {
        addEvents: function(callback) {
                wx.onTouchStart(e => touchstartHandler(e));
                wx.onTouchEnd(e => touchendHandler(e, callback));
        },
        removeEvents: function() {
                wx.offTouchStart();
                wx.offTouchEnd();
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

function touchendHandler(e, callback) {
        for (let btn in btnAreas) {
                if (touchstart[btn] && isTouchedOn(e, btn)) {
                        callback(btn);
                }
                touchstart[btn] = false;
        }
}