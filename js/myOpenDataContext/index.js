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
                keyList: ["maxRecord"],
                success: data => {

                        let prevRecord;
                        if (data.KVDataList.length > 0) {
                                prevRecord = parseInt(data.KVDataList[0].value);
                        }

                        let updates =
                                (!prevRecord || prevRecord < newScore ? [{
                                        key: "maxRecord",
                                        value: newScore.toString()
                                }] : [])
                                .concat([{
                                        key: "currentScore",
                                        value: newScore.toString()
                                }]);
                        wx.setUserCloudStorage({
                                KVDataList: updates,
				success: function() {
					drawRankListThumbnail();
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