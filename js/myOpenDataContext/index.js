import Shared from "./shared";
let shared = new Shared();

let drawRankList = require('./utilities/drawRankList');
let rankListThumbnail = require('./utilities/drawRankListThumbnail');

wx.onMessage(data => {
        if (data.cmd == "showRankList") {
                drawRankList();
        }

        if (data.cmd == "updateScore") {
		rankListThumbnail.drawBackground();
                updateScore(data.score);
        }

        if (data.cmd == "clearSharedCanvas") {
                shared.ctx.clearRect(0, 0, shared.canvasWidth, shared.canvasHeight);
        }
})

function updateScore(newScore) {
        wx.getUserCloudStorage({
		
                keyList: ["weekRecord", "maxRecord"],
                success: data => {

                        let maybeWeekRecord = data.KVDataList[data.KVDataList.findIndex(kv => {
                                return kv.key == "weekRecord";
                        })];
                        let weekRecord = maybeWeekRecord ? parseInt(maybeWeekRecord.value) : undefined;

                        let maybeMaxRecord = data.KVDataList[data.KVDataList.findIndex(kv => {
                                return kv.key == "maxRecord";
                        })];
                        let maxRecord = maybeMaxRecord ? parseInt(maybeMaxRecord.value) : undefined;

                        let updates = [{
                                        key: "currentScore",
                                        value: newScore.toString()
                                }]
                                .concat((!weekRecord || weekRecord < newScore ? [{
                                        key: "weekRecord",
                                        value: newScore.toString()
                                }] : []))
                                .concat((!maxRecord || maxRecord < weekRecord ? [{
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