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
        }
}

/*----------------------------------------------------------------------------*/

module.exports = {
        addEvents: function() {
                !this.touchender ? this.touchender = this.touchendHandler.bind(this) : true;
                canvas.addEventListener('touchend', this.touchender);
        },
        removeEvents: function() {
                this.hasEventBind = false;
                canvas.removeEventListener('touchend', this.touchender);
        }
}

function isClicked(e, btn) {
	let x = (e.touches[0] || e.changedTouches[0]).clientX;
	let y = (e.touches[0] || e.changedTouches[0]).clientY;
	let area = btnAreas[btn];
	return x >= area.startX && x <= area.endX && y >= area.startY && y <= area.endY;
}

function callback(btn) {
        if (!gameInfo.start) {

                if (isClicked(e, "RankListReturn")) {
                        gameInfo.showRank = false;
                }

                //////////////////////////////////////////////////////////////////////////////////////////
                // if (isClicked(e, "GroupRankList")) {
                // 	wx.shareAppMessage({
                // 		title: '转发标题'
                // 	});
                // }

                if (gameInfo.showRank) {
                        return;
                }

                if (isClicked(e, "StartBtn")) {
                        gameInfo.reset();
                        this.removeEvents();
                }

                if (isClicked(e, "RankListIcon")) {
                        gameInfo.showRank = true;
                        gameInfo.openDataContext.postMessage({
                                cmd: "showRankList"
                        });
                }
        }

        if (gameInfo.start) {
                if (gameInfo.over) {
                        if (isClicked(e, "RestartButton")) {
                                gameInfo.reset();

                                // cannot change the status of the spiral later in touchendHandler
                                // since the non-stopping loop will execute update first instead of
                                // touchendHandler.
                                this.spiral.toChange = true;
                        }
                }

                if (!gameInfo.over) {
                        this.removeEvents();
                }
        }
}