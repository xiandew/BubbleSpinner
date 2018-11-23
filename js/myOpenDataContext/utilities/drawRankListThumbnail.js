import Shared from "../shared";
let shared = new Shared();

/*----------------------------------------------------------------------------*/

let ctx = shared.ctx;
let canvasWidth = shared.canvasWidth;
let canvasHeight = shared.canvasHeight;

const SCORE_SIZE = 0.15 * canvasWidth;
const SCORE_X = 0.5 * canvasWidth;
const SCORE_Y = 0.1 * canvasHeight;

const PANEL_WIDTH = 0.85 * canvasWidth;
const PANEL_HEIGHT = 0.2 * canvasHeight;
const PANEL_START_Y = 0.2 * canvasHeight;
const PANEL_START_X = (canvasWidth - PANEL_WIDTH) / 2;

const RANK_ITEM_WIDTH = PANEL_WIDTH / 3;


////////////////////////////////////////////////////////////
// const TEXT_SIZE = 0.0175 * canvas.height;

// const TEXT_BG_WIDTH = 0.85 * canvas.width;
// const TEXT_BG_HEIGHT = TEXT_SIZE * 2;
// const TEXT_BG_START_X = 0.075 * canvas.width;
// const TEXT_BG_START_Y = 0.4 * canvas.height;

// const VIEW_ALL_Y = TEXT_BG_START_Y + TEXT_SIZE;
// const VIEW_ALL_X = 1;

/*----------------------------------------------------------------------------*/

// triple ranks to be drawn
let triple = [undefined, undefined, undefined];

module.exports = function() {

        wx.getFriendCloudStorage({
                keyList: ["maxRecord", "currentScore"],
                success: res => {
                        res.data.sort((d1, d2) => {
                                return parseInt(d2.KVDataList[0].value) -
                                        parseInt(d1.KVDataList[0].value);
                        });

			shared.ranks = res.data;

                        // find the triples
                        wx.getUserInfo({
                                openIdList: ['selfOpenId'],
                                success: function(res) {
                                        let userInfo = res.data[0];

                                        let nickName = userInfo.nickName;
                                        let avatarUrl = userInfo.avatarUrl;

					shared.selfRankIndex = shared.ranks.findIndex(user => {
                                                return user.nickname == nickName &&
                                                        user.avatarUrl == avatarUrl;
                                        });

					shared.selfRank = shared.ranks[shared.selfRankIndex];

					triple[0] = shared.ranks[shared.selfRankIndex - 1];
					triple[1] = shared.ranks[shared.selfRankIndex];
					triple[2] = shared.ranks[shared.selfRankIndex + 1];

					drawBackground();
                                }
                        });

                        drawRankPanel();
                }
        });
}

function drawRankPanel() {
        for (let i = 0; i < triple.length; i++) {
		if(triple[i]){
			continue;
		}
		ctx.beginPath();

		ctx.fillStyle = 

		ctx.closePath();
        }
}

function drawBackground() {
	ctx.beginPath();
	ctx.fillStyle = "rgba(117, 119, 126, 0.8)";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.closePath();

	if (shared.fontLoaded) {
		shared.txt.fontSize = SCORE_SIZE;
		shared.txt.textAlign = "center";
		shared.txt.draw(ctx, triple[1].KVDataList[1].value, SCORE_X, SCORE_Y);
	}

	// ctx.fillStyle = "#3c3c3c";
	// ctx.fillRect(TEXT_BG_START_X, TEXT_BG_START_Y, TEXT_BG_WIDTH, TEXT_BG_HEIGHT);

	// ctx.fillStyle = "#9b9b9b";
	// ctx.font = TEXT_SIZE / 1.8 + "px Arial";
	// ctx.textAlign = "left";
	// ctx.fillText("排行榜 · 每周一凌晨刷新", TEXT_BG_START_X + 50, TEXT_BG_START_Y + 35);
}