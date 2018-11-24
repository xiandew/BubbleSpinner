import Shared from "../shared";
let shared = new Shared();
let canvasWidth = wx.getSystemInfoSync().screenWidth;
let canvasHeight = wx.getSystemInfoSync().screenHeight;

/*----------------------------------------------------------------------------*/

const RANK_LIST_RETURN = {
	startX: 0.08 * canvasWidth,
	startY: 0.9 * canvasHeight,
	endX: 0.16 * canvasWidth,
	endY: 0.98 * canvasHeight
}

const FULL_RANK_TEXTAREA = {
	startX: 0.642 * canvasWidth,
	startY: 0.5 * canvasHeight,
	endX: 0.925 * canvasWidth,
	endY: 0.544 * canvasHeight
};

module.exports = function (e, btn) {
	let x = e.touches[0].clientX;
	let y = e.touches[0].clientY;
	let area;
	switch (btn) {
		case "RankListReturn":
			area = RANK_LIST_RETURN;
			break;
		case "FullRankList":
			area = FULL_RANK_TEXTAREA;
			break;
	}
	return x >= area.startX && x <= area.endX && y >= area.startY && y <= area.endY;
}