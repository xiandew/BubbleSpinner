import Shared from "./shared";
let shared = new Shared();

let drawRankList = require('./utilities/drawRankList');
let rankListThumbnail = require('./utilities/drawRankListThumbnail');
let valueOf = require("./utilities/valueOf");
let getCurrentWeek = require("./utilities/getCurrentWeek");

wx.onMessage(data => {

        switch (data.cmd) {
                case "showRankList":
                        drawRankList();
                        break;

                case "updateScore":
                        rankListThumbnail.drawBackground();
                        updateScore(data.score);
                        break;

                case "clearSharedCanvas":
                        shared.ctx.clearRect(0, 0, shared.canvasWidth, shared.canvasHeight);
                        break;

                case "groupRankList":
			drawRankList(data.ticket);
                        break;
        }
})

function updateScore(newScore) {
        wx.getUserCloudStorage({

                keyList: ["week", "wkRecord", "maxRecord"],
                success: data => {

                        let week = valueOf("week", data.KVDataList);
                        let weekRecord = valueOf("wkRecord", data.KVDataList);
                        let maxRecord = valueOf("maxRecord", data.KVDataList);

                        let currentWeek = getCurrentWeek();

                        let updates = [{
                                        key: "currentScore",
                                        value: newScore.toString()
                                }]
                                .concat((week != currentWeek ? [{
                                        key: "week",
                                        value: currentWeek.toString()
                                }] : []))
                                .concat((week != currentWeek || weekRecord < newScore ? [{
                                        key: "wkRecord",
                                        value: newScore.toString()
                                }] : []))
                                .concat((maxRecord < newScore ? [{
                                        key: "maxRecord",
                                        value: newScore.toString()
                                }] : []));

                        wx.setUserCloudStorage({
                                KVDataList: updates,
                                success: function() {
                                        rankListThumbnail.draw();
                                },
                                fail: function() {
                                        console.log('分数上传失败');
                                }
                        });
                },
                fail: function() {
                        console.log('分数获取失败');
                }
        });
}