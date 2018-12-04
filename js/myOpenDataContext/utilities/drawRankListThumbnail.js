import Shared from "../shared";
let shared = new Shared();

let touch = require("./touch");
let valueOf = require("./valueOf");
let drawText = require("./drawText");
let drawButton = require("./drawButton");
let drawRankList = require("./drawRankList");
let getCurrentWeek = require("./getCurrentWeek");

/*----------------------------------------------------------------------------*/

let ctx = shared.ctx;
let canvasWidth = shared.canvasWidth;
let canvasHeight = shared.canvasHeight;

const SCORE_SIZE = 0.15 * canvasWidth;
const SCORE_X = 0.5 * canvasWidth;
const SCORE_Y = 0.1 * canvasHeight;

const PANEL_WIDTH = 0.85 * canvasWidth;
const PANEL_HEIGHT = 0.225 * canvasHeight;
const PANEL_START_Y = 0.3 * canvasHeight;
const PANEL_START_X = (canvasWidth - PANEL_WIDTH) / 2;

const RANK_ITEM_WIDTH = PANEL_WIDTH / 3;

const TEXT_SIZE = 0.0175 * canvasHeight;

const TEXT_BG_HEIGHT = TEXT_SIZE * 2.5;
const TEXT_BG_START_Y = PANEL_START_Y + PANEL_HEIGHT;
const TEXT_START_Y = TEXT_BG_START_Y + TEXT_SIZE * 1.65;

const AVATAR_SIZE = PANEL_HEIGHT * 0.225;
const AVATAR_START_X = (RANK_ITEM_WIDTH - AVATAR_SIZE) / 2;

const RESTART_BTN = {
        imgSrc: 'images/restartGame.png',
        x: 0.5 * canvasWidth,
        y: 0.75 * canvasHeight,
        h: 0.05 * canvasWidth,
        w: 0.2542 * canvasWidth,
        bgColour: "#ffffff",
        area: {
                startX: 0.2679 * canvasWidth,
                endX: 0.7321 * canvasWidth,
                startY: 0.75 * canvasHeight - 0.07 * canvasWidth,
                endY: 0.75 * canvasHeight + 0.07 * canvasWidth,
                w: 0.4642 * canvasWidth,
                h: 0.14 * canvasWidth
        }
};

const MAX_RECORD_START_Y = 0.95 * canvasHeight;

/*----------------------------------------------------------------------------*/

// triple ranks to be drawn
let triple = [undefined, undefined, undefined];

module.exports = {
        draw: function() {
                shared.asyncAllowed = false;

                wx.getFriendCloudStorage({
                        keyList: ["week", "wkRecord", "currentScore", "maxRecord"],
                        success: res => {
                                res.data = res.data.filter(d => {
                                        return valueOf("week", d.KVDataList) == getCurrentWeek();
                                });

                                res.data.sort((d1, d2) => {
                                        return parseInt(valueOf("wkRecord", d2.KVDataList)) -
                                                parseInt(valueOf("wkRecord", d1.KVDataList));
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

                                                drawRankPanel();

                                                touch.addEvents(callback);
                                        }
                                });
                        }
                });
        },

        drawBackground: function() {
                drawBackground();
                drawButton(RESTART_BTN);
        }

}

function callback(clicked) {

        switch (clicked) {
                case "FullRankList":
                        if (!shared.asyncAllowed) {
                                shared.asyncAllowed = true;
                                drawRankList();
                        }
                        break;

                case "RankListReturn":
                        if (shared.asyncAllowed) {
                                shared.asyncAllowed = false;
                                drawRankListThumbnail();
                        }
                        break;

                case "GroupRankList":
                        break;

                case "Restart":
                        touch.removeEvents();
                        break;
        }
}

function drawRankListThumbnail() {
        drawBackground();
        drawButton(RESTART_BTN);
        drawRankPanel();
}

function drawRankPanel() {
        if (shared.fontLoaded) {
                shared.txt.fontSize = SCORE_SIZE;
                shared.txt.textAlign = "center";
                shared.txt.draw(ctx, valueOf("currentScore", triple[1].KVDataList), SCORE_X, SCORE_Y);
        }

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
                ctx.font = `italic bold ${TEXT_SIZE * 1.2}px Arial`;
                ctx.textAlign = "center";
                ctx.fillText(
                        shared.selfRankIndex + i,
                        centX,
                        PANEL_START_Y + PANEL_HEIGHT * 0.15
                );

                ctx.fillStyle = "#888888";
                ctx.textAlign = "center";
                drawText(
                        ctx,
                        TEXT_SIZE,
                        triple[i].nickname,
                        centX,
                        PANEL_START_Y + PANEL_HEIGHT * 0.65,
                        RANK_ITEM_WIDTH
                );

                if (shared.fontLoaded) {
                        shared.txt.fontSize = TEXT_SIZE * 1.5;
                        shared.txt.textAlign = "center";
                        shared.txt.draw(
                                ctx,
                                valueOf("wkRecord", triple[i].KVDataList),
                                centX,
                                PANEL_START_Y + PANEL_HEIGHT * 0.775
                        );
                }


                let avatar = wx.createImage();
                avatar.onload = function() {
                        ctx.drawImage(
                                avatar,
                                PANEL_START_X + AVATAR_START_X + RANK_ITEM_WIDTH * i,
                                PANEL_START_Y + PANEL_HEIGHT * 0.25,
                                AVATAR_SIZE,
                                AVATAR_SIZE
                        );
                }
                avatar.src = triple[i].avatarUrl;
        }

        ctx.fillStyle = "#ffffff";
        ctx.font = `${TEXT_SIZE}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(
                `历史最高分 : ${valueOf("maxRecord", triple[1].KVDataList)}`,
                0.5 * canvasWidth,
                MAX_RECORD_START_Y
        );
}

function drawBackground() {
        ctx.clearRect(0, 0, shared.canvasWidth, shared.canvasHeight);

        ctx.beginPath();
        var lineGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        lineGradient.addColorStop(0, 'rgba(117, 119, 126, 0.8)');
        lineGradient.addColorStop(1, 'rgba(104, 105, 110, 0.9)');
        ctx.fillStyle = lineGradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.closePath();

        ctx.fillStyle = "#3f3f3f";
        ctx.fillRect(PANEL_START_X, PANEL_START_Y, PANEL_WIDTH, PANEL_HEIGHT);

        ctx.fillStyle = "#888888";
        ctx.font = `${TEXT_SIZE}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("加载中", 0.5 * canvasWidth, PANEL_START_Y + 0.6 * PANEL_HEIGHT);

        ctx.fillStyle = "#3c3c3c";
        ctx.fillRect(PANEL_START_X, TEXT_BG_START_Y, PANEL_WIDTH, TEXT_BG_HEIGHT);

        ctx.fillStyle = "#9b9b9b";
        ctx.font = `${TEXT_SIZE}px Arial`;
        ctx.textAlign = "left";
        ctx.fillText("排行榜 · 每周一凌晨刷新", PANEL_START_X + TEXT_SIZE, TEXT_START_Y);

        ctx.fillStyle = "#ffffff";
        ctx.font = `${TEXT_SIZE}px Arial`;
        ctx.textAlign = "right";
        ctx.fillText("查看全部排行 ►", canvasWidth - PANEL_START_X - 0.8 * TEXT_SIZE, TEXT_START_Y);
}