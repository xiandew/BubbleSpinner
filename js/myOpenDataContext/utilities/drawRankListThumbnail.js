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
const PANEL_START_Y = 0.3 * canvasHeight;
const PANEL_START_X = (canvasWidth - PANEL_WIDTH) / 2;

const RANK_ITEM_WIDTH = PANEL_WIDTH / 3;

const TEXT_SIZE = 0.0175 * canvasHeight;

const TEXT_BG_HEIGHT = TEXT_SIZE * 2.5;
const TEXT_BG_START_Y = PANEL_START_Y + PANEL_HEIGHT;
const TEXT_START_Y = TEXT_BG_START_Y + TEXT_SIZE * 1.5;

const AVATAR_SIZE = PANEL_HEIGHT * 0.33;
const AVATAR_START_X = (RANK_ITEM_WIDTH - AVATAR_SIZE) / 2;

const MAX_RECORD_START_Y = 0.95 * canvasHeight;

/*----------------------------------------------------------------------------*/

// triple ranks to be drawn
let triple = [undefined, undefined, undefined];

module.exports = function() {

        wx.getFriendCloudStorage({
		keyList: ["currentScore", "weekRecord", "maxRecord"],
                success: res => {
			res.data = res.data.filter(d => d.KVDataList.length == 3);

                        res.data.sort((d1, d2) => {
                                return parseInt(d2.KVDataList[1].value) -
                                        parseInt(d1.KVDataList[1].value);
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
                                        drawRankPanel();
                                }
                        });
                }
        });
}

function drawRankPanel() {
        for (let i = 0; i < triple.length; i++) {
                ctx.beginPath();

                ctx.fillStyle = i == 1 ? "#434343" : "#3f3f3f";
                ctx.fillRect(
                        PANEL_START_X + RANK_ITEM_WIDTH * i,
                        PANEL_START_Y,
                        RANK_ITEM_WIDTH,
                        PANEL_HEIGHT
                );

                ctx.closePath();

                if (!triple[i]) {
                        continue;
                }

		let centX = PANEL_START_X + RANK_ITEM_WIDTH * (i + 0.5);

                ctx.fillStyle = i == 1 ? "#41bf8c" : "#888888";
		ctx.font = "italic bold " + TEXT_SIZE + "px Arial";
		ctx.textAlign = "center";
		ctx.fillText(
			shared.selfRankIndex + i,
			centX,
			PANEL_START_Y + PANEL_HEIGHT * 0.15
		);

		ctx.fillStyle = "#888888";
		ctx.font = TEXT_SIZE + "px Arial";
		ctx.textAlign = "center";
		ctx.fillText(triple[i].nickname, centX, PANEL_START_Y + PANEL_HEIGHT * 0.7);

		if (shared.fontLoaded) {
			shared.txt.fontSize = TEXT_SIZE * 1.5;
			shared.txt.textAlign = "center";
			shared.txt.draw(
				ctx,
				triple[i].KVDataList[1].value,
				centX,
				PANEL_START_Y + PANEL_HEIGHT * 0.8
			);
		}

		
                let avatar = wx.createImage();
                avatar.onload = function() {
                        ctx.drawImage(
                                avatar,
                                PANEL_START_X + AVATAR_START_X + RANK_ITEM_WIDTH * i,
                                PANEL_START_Y + PANEL_HEIGHT * 0.225,
                                AVATAR_SIZE,
                                AVATAR_SIZE
                        );
                }
                avatar.src = triple[i].avatarUrl;
        }
}

function drawBackground() {
	ctx.clearRect(0, 0, shared.canvasWidth, shared.canvasHeight);

        ctx.beginPath();
        var lineGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        lineGradient.addColorStop(0, 'rgba(117, 119, 126, 0.8)');
        lineGradient.addColorStop(1, 'rgba(105, 106, 111, 0.8)');
        ctx.fillStyle = lineGradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.closePath();

        if (shared.fontLoaded) {
                shared.txt.fontSize = SCORE_SIZE;
                shared.txt.textAlign = "center";
                shared.txt.draw(ctx, triple[1].KVDataList[0].value, SCORE_X, SCORE_Y);
        }

        ctx.fillStyle = "#3c3c3c";
        ctx.fillRect(PANEL_START_X, TEXT_BG_START_Y, PANEL_WIDTH, TEXT_BG_HEIGHT);

        ctx.fillStyle = "#9b9b9b";
        ctx.font = TEXT_SIZE + "px Arial";
        ctx.textAlign = "left";
        ctx.fillText("排行榜 · 每周一凌晨刷新", PANEL_START_X + TEXT_SIZE, TEXT_START_Y);

        ctx.fillStyle = "#ffffff";
        ctx.font = TEXT_SIZE + "px Arial";
        ctx.textAlign = "right";
        ctx.fillText("查看全部排行 ►", canvasWidth - PANEL_START_X - TEXT_SIZE, TEXT_START_Y);

        ctx.font = TEXT_SIZE + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
                "历史最高分 : " + triple[1].KVDataList[2].value,
                0.5 * canvasWidth,
                MAX_RECORD_START_Y
        );
}