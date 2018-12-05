import Shared from "../shared";
let shared = new Shared();

let drawButton = require("./drawButton");
let drawText = require("./drawText");
let valueOf = require("./valueOf");
let getCurrentWeek = require("./getCurrentWeek");

/*----------------------------------------------------------------------------*/

let ctx = shared.ctx;
let canvasWidth = shared.canvasWidth;
let canvasHeight = shared.canvasHeight;

const TITLE_SIZE = 0.0325 * canvasHeight;
const TITLE_X = 0.5 * canvasWidth;
const TITLE_Y = 0.125 * canvasHeight;

const PANEL_WIDTH = 0.85 * canvasWidth;
const PANEL_HEIGHT = 0.5 * canvasHeight;
const PANEL_START_Y = 0.2 * canvasHeight;

const BG_HEIGHT = PANEL_HEIGHT + 1.05 * TITLE_SIZE;
const BG_START_X = 0.075 * canvasWidth;
const BG_START_Y = PANEL_START_Y - 1.05 * TITLE_SIZE;

const RANK_ITEM_HEIGHT = PANEL_HEIGHT / 6;
const AVATAR_SIZE = 0.5 * RANK_ITEM_HEIGHT;
const AVATAR_START_X = 105;
const AVATAR_START_Y = 0.25 * RANK_ITEM_HEIGHT;

const SELF_RANK_START_Y = 0.725 * canvasHeight;

const RETURN_START_X = 0.08 * canvasWidth;
const RETURN_START_Y = 0.9 * canvasHeight;
const RETURN_HEIGHT = 0.08 * canvasWidth;
const RETURN_WIDTH = RETURN_HEIGHT;

const GROUP_RANK_BTN = {
        imgSrc: 'images/groupRank.png',
        x: 0.728 * canvasWidth,
        y: 0.923 * canvasHeight,
        h: 0.04 * canvasWidth,
        bgColour: "#3f3f3f",
        area: {
                startX: 0.544 * canvasWidth,
                endX: 0.912 * canvasWidth,
                startY: 0.923 * canvasHeight - 0.056 * canvasWidth,
                endY: 0.923 * canvasHeight + 0.056 * canvasWidth,
                w: 0.368 * canvasWidth,
                h: 0.112 * canvasWidth
        }
};
GROUP_RANK_BTN.w = GROUP_RANK_BTN.h * 5;

/*----------------------------------------------------------------------------*/

let rankListCanvas = wx.createCanvas();
let rankList = rankListCanvas.getContext('2d');
rankListCanvas.width = PANEL_WIDTH;

let selfRankCanvas = wx.createCanvas();
let selfRank = selfRankCanvas.getContext('2d');
selfRankCanvas.width = PANEL_WIDTH;
selfRankCanvas.height = 0.125 * canvasHeight;

let currentPage;

let groupRank;
let ranks;

/*----------------------------------------------------------------------------*/

module.exports = function(ticket) {
        groupRank = ticket ? true : false;

        currentPage = 0;
        drawBackground();

        if (groupRank) {
                wx.getGroupCloudStorage({
                        shareTicket: ticket,
                        keyList: ["week", "wkRecord"],
                        success: res => drawRankList(res)
                });
        } else {
                if (shared.ranks && shared.selfRank) {
                        ranks = shared.ranks;

                        drawPage(currentPage);
                        drawSelfRank();
                }
                wx.getFriendCloudStorage({
                        keyList: ["week", "wkRecord"],
                        success: res => drawRankList(res)
                });
        }
}

function drawRankList(res) {
        res.data = res.data.filter(d => {
                return valueOf("week", d.KVDataList) == getCurrentWeek();
        });

        res.data.sort((d1, d2) => {
                return valueOf("wkRecord", d2.KVDataList) -
                        valueOf("wkRecord", d1.KVDataList);
        });

        if (!groupRank) {
                shared.ranks = res.data;
        }
        ranks = res.data;

        wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: function(user) {
                        let userInfo = user.data[0];

                        let nickName = userInfo.nickName;
                        let avatarUrl = userInfo.avatarUrl;

                        shared.selfRankIndex = ranks.findIndex(user => {
                                return user.nickname == nickName &&
                                        user.avatarUrl == avatarUrl;
                        });

                        if (shared.selfRankIndex < 0) {
                                shared.selfRankIndex = ranks.length;
                                shared.selfRank = {
                                        avatarUrl: avatarUrl,
                                        nickname: nickName,
                                        KVDataList: [{
                                                key: "wkRecord",
                                                value: 0
                                        }]
                                }
                                ranks.push(shared.selfRank);
                        } else {
                                shared.selfRank = ranks[shared.selfRankIndex];
                        }

                        rankListCanvas.height = Math.ceil(ranks.length / 6) * PANEL_HEIGHT;
                        if (shared.asyncAllowed) {
                                drawPage(currentPage);
                                drawSelfRank();
                        }
                }
        })
}



function drawPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= Math.ceil(ranks.length / 6)) {
                return;
        }
        currentPage = pageIndex;

        rankList.clearRect(0, 0, rankListCanvas.width, rankListCanvas.height);

        let first = pageIndex * 6;
        let last = first + Math.min(6, ranks.length - first);

        for (let i = first; i < last; i++) {
                let user = ranks[i];

                // alternating colours of items
                if (i % 2) {
                        rankList.beginPath();
                        rankList.fillStyle = "#3f3f3f";
                        rankList.fillRect(0, RANK_ITEM_HEIGHT * i, PANEL_WIDTH, RANK_ITEM_HEIGHT);
                        rankList.closePath();
                }

                drawRankText(
                        i,
                        user,
                        RANK_ITEM_HEIGHT * i + 0.5875 * RANK_ITEM_HEIGHT,
                        rankList
                );

                let avatar = wx.createImage();
                avatar.pageIndex = pageIndex;
                avatar.onload = function() {
                        if (avatar.pageIndex != pageIndex) {
                                return;
                        }

                        rankList.drawImage(
                                avatar,
                                AVATAR_START_X,
                                RANK_ITEM_HEIGHT * i + AVATAR_START_Y,
                                AVATAR_SIZE,
                                AVATAR_SIZE
                        );

                        ctx.fillStyle = '#3c3c3c';
                        ctx.fillRect(BG_START_X, PANEL_START_Y, PANEL_WIDTH, PANEL_HEIGHT);
                        ctx.drawImage(
                                rankListCanvas,
                                0,
                                PANEL_HEIGHT * pageIndex,
                                PANEL_WIDTH,
                                PANEL_HEIGHT,
                                BG_START_X,
                                PANEL_START_Y,
                                PANEL_WIDTH,
                                PANEL_HEIGHT
                        );
                }
                avatar.src = user.avatarUrl;
        }
}

function drawSelfRank() {
        selfRank.clearRect(0, 0, selfRankCanvas.width, selfRankCanvas.height);

        drawRankText(
                shared.selfRankIndex,
                shared.selfRank,
                selfRankCanvas.height / 1.75,
                selfRank);

        let avatar = wx.createImage();
        avatar.onload = function() {
                selfRank.drawImage(
                        avatar,
                        AVATAR_START_X,
                        selfRankCanvas.height * 0.35,
                        AVATAR_SIZE,
                        AVATAR_SIZE
                );

                ctx.fillStyle = "#3f3f3f";
                ctx.fillRect(BG_START_X, SELF_RANK_START_Y, PANEL_WIDTH, selfRankCanvas.height);
                ctx.drawImage(
                        selfRankCanvas,
                        BG_START_X,
                        SELF_RANK_START_Y,
                        PANEL_WIDTH,
                        selfRankCanvas.height
                );
        }
        avatar.src = shared.selfRank.avatarUrl;
}

function drawRankText(i, user, textHeight, ctx) {

        ctx.beginPath();
        ctx.fillStyle = i == 0 ? '#fa7e00' : i == 1 ? '#fec11e' : i == 2 ? '#fbd413' : '#ffffff';

        ctx.font = `italic bold ${AVATAR_SIZE / 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(i + 1, 50, textHeight);
        ctx.closePath();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';

        drawText(
                ctx,
                AVATAR_SIZE / 2,
                user.nickname,
                190,
                textHeight,
                250
        );

        if (shared.fontLoaded) {
                shared.txt.fontSize = RANK_ITEM_HEIGHT / 3;
                shared.txt.textAlign = 'right';
                shared.txt.draw(
                        ctx,
                        valueOf("wkRecord", user.KVDataList),
                        580,
                        textHeight - 0.3 * RANK_ITEM_HEIGHT
                );
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

        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${TITLE_SIZE}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(groupRank ? "群排行榜" : "好友排行榜", TITLE_X, TITLE_Y);

        ctx.fillStyle = "#3c3c3c";
        ctx.fillRect(BG_START_X, BG_START_Y, PANEL_WIDTH, BG_HEIGHT);

        ctx.fillStyle = "#9b9b9b";
        ctx.font = `${TITLE_SIZE / 1.8}px Arial`;
        ctx.textAlign = "left";
        ctx.fillText("每周一凌晨刷新", BG_START_X + 50, BG_START_Y + 35);

        ctx.fillStyle = "#9b9b9b";
        ctx.font = `${TITLE_SIZE / 1.5}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("加载中", canvasWidth / 2, PANEL_START_Y + PANEL_HEIGHT / 2);

        // my rank background
        ctx.fillStyle = "#3f3f3f";
        ctx.fillRect(BG_START_X, SELF_RANK_START_Y, PANEL_WIDTH, selfRankCanvas.height);

        ctx.fillStyle = "#9b9b9b";
        ctx.font = `${TITLE_SIZE / 1.5}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("加载中", canvasWidth / 2, SELF_RANK_START_Y + selfRankCanvas.height / 1.75);

        // return button
        let return_btn = wx.createImage();
        return_btn.onload = function() {
                ctx.drawImage(
                        return_btn,
                        RETURN_START_X,
                        RETURN_START_Y,
                        RETURN_WIDTH,
                        RETURN_HEIGHT
                );
        }
        return_btn.src = 'images/return.png';

        if (!groupRank) {
                drawButton(GROUP_RANK_BTN);
        }
}


let startY, endY;
let screenWidth = wx.getSystemInfoSync().screenWidth;
wx.onTouchStart(e => {
        startY = e.touches[0].clientY / screenWidth * canvasWidth;
});
wx.onTouchMove(e => {
        endY = e.touches[0].clientY / screenWidth * canvasWidth;
});
wx.onTouchEnd(e => {
        if (!ranks || !shared.asyncAllowed ||
                !(startY >= PANEL_START_Y &&
                        startY <= PANEL_START_Y + PANEL_HEIGHT)) {
                return;
        }

        if (endY > startY) {
                drawPage(currentPage - 1);
        }
        if (endY < startY) {
                drawPage(currentPage + 1);
        }
});