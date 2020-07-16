import DataStore from "../data/DataStore.js";
import Sprite from "../base/Sprite.js";
import Scene from "./Scene.js";
import Grid from "../utils/Grid.js";
import Text from "../utils/Text.js";

export default class GameEnded extends Scene {
    constructor() {
        super();

        // background for the leaderboard thumbnail (mx = 7.5%, top = 30%, height = 27.5%)
        this.leaderboardThumbnailBackground = new Grid(
            0.3 * DataStore.canvasHeight,
            0.275 * DataStore.canvasHeight,
            0.075 * DataStore.canvasWidth,
            0.06 * DataStore.canvasWidth
        );
        // meta (top = 30%, height = 5%)
        this.header = new Text(
            "排行榜 · 每周一凌晨刷新",
            0.015 * DataStore.canvasHeight,
            0.05 * DataStore.canvasHeight
        );
        this.more = new Text(
            "查看全部排行 ⮞",
            0.015 * DataStore.canvasHeight,
            0.05 * DataStore.canvasHeight,
            0,
            -0.03 * DataStore.canvasWidth
        );
        this.loading = new Text(
            "加载中",
            this.header.fontSize,
            this.leaderboardThumbnailBackground.height - this.header.lineHeight
        );

        this.drawLayout();


        // this.leaderboardThumbnail = wx.createCanvas();
        // this.leaderboardThumbnail


        this.drawRanks();

        wx.getFriendCloudStorage({
            keyList: ["week", "wkRecord", "currentScore", "maxRecord"],
            success: (res) => {
                function getCurrentWeek() {
                    let today = new Date();
                    let newYearsDate = new Date(today.getFullYear(), 0, 1);

                    // start from Monday
                    let offsetDays = 1;
                    let newYearsDay = newYearsDate.getDay();
                    if (newYearsDay != 0) {
                        offsetDays += (7 - newYearsDay);
                    }

                    let firstMonday = new Date(today.getFullYear(), 0, 1 + offsetDays);
                    let days = Math.ceil(
                        (today.valueOf() - firstMonday.valueOf()) / 86400000
                    );

                    // Count the first full week as 1 and the last as 52
                    return Math.ceil(days / 7) + 1;
                };

                let userRecords = res.data.map(rawUserRecord => {
                    let userRecord = {
                        nickname: rawUserRecord.nickname,
                        avatarUrl: rawUserRecord.avatarUrl,
                        week: null,
                        wkRecord: null,
                        currentScore: null,
                        maxRecord: null
                    };
                    rawUserRecord.KVDataList.forEach(KVData => { userRecord[KVData.key] = userRecord[KVData.value] });
                    return userRecord;
                });

                let currentWeek = getCurrentWeek();
                let currentWeekRecords = userRecords.filter(userRecord => userRecord.week == currentWeek);
                currentWeekRecords.sort((r1, r2) => r2.wkRecord - r1.wkRecord);

                // Find the one record before, the user's record and the one after
                wx.getUserInfo({
                    openIdList: ['selfOpenId'],
                    success: (res) => {
                        let [user] = res.data;
                        let nickname = user.nickName;
                        let avatarUrl = user.avatarUrl;
                        let rank = currentWeekRecords.findIndex(r => r.nickname == nickname && r.avatar == avatarUrl);

                        this.drawRanks([
                            currentWeekRecords[rank - 1],
                            currentWeekRecords[rank],
                            currentWeekRecords[rank + 1]
                        ]);
                    }
                });
            }
        });
    }

    drawLayout() {
        this.ctx.fillStyle = "rgba(63, 63, 63, 0.5)";
        this.ctx.strokeStyle = "rgba(80, 80, 80, 1)";
        this.leaderboardThumbnailBackground.draw(this.ctx);

        this.ctx.fillStyle = "#9b9b9b";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.header.draw(this.ctx, this.leaderboardThumbnailBackground.mr + this.leaderboardThumbnailBackground.pr, this.leaderboardThumbnailBackground.top + 0.5 * (this.header.lineHeight - this.header.fontSize));

        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "right";
        this.more.draw(this.ctx, DataStore.canvasWidth - this.leaderboardThumbnailBackground.ml - this.leaderboardThumbnailBackground.pl - this.more.ml, this.header.top);

        // hr
        this.ctx.beginPath();
        this.ctx.moveTo(this.leaderboardThumbnailBackground.mr, this.leaderboardThumbnailBackground.top + this.header.lineHeight);
        this.ctx.lineTo(DataStore.canvasWidth - this.leaderboardThumbnailBackground.ml, this.leaderboardThumbnailBackground.top + this.header.lineHeight);
        this.ctx.stroke();
    }

    drawRanks(ranks) {
        if (!ranks) {
            this.ctx.fillStyle = "#888888";
            this.ctx.textAlign = "center";
            this.loading.draw(this.ctx, 0.5 * DataStore.canvasWidth, this.leaderboardThumbnailBackground.top + this.header.lineHeight + 0.5 * this.loading.lineHeight);
        }
    }

    render() {
        this.sprite.render(DataStore.ctx);
    }

    static getInstance() {
        if (!GameEnded.instance) {
            GameEnded.instance = new GameEnded();
        }
        return GameEnded.instance;
    }
}