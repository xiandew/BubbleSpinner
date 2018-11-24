import Shared from "./shared";
let shared = new Shared();

let drawRankList = require('./utilities/drawRankList');
let drawRankListThumbnail = require('./utilities/drawRankListThumbnail');

wx.onMessage(data => {
        if (data.cmd == "showRankList") {
                drawRankList();
        }

        if (data.cmd == "updateScore") {
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
                        console.log(data);

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
                                        drawRankListThumbnail();
                                },
                                fail: function() {
                                        console.log('分数上传失败');

                                        // 绘制返回主页和重玩，重试，"分数更新失败，请检查网络连接"
                                }
                        });
                },
                fail: function() {
                        console.log('分数获取失败');

                        // 绘制返回主页和重玩，重试，"分数上传失败，请检查网络连接"
                }
        });
}