import {
        START_BTN,
        RESTART_BTN,
        RANK_LIST_ICON
} from '../runtime/scene';

const RANK_LIST_RETURN = {
	startX: 0.08 * canvas.width,
	startY: 0.9 * canvas.height,
	endX: 0.16 * canvas.width,
	endY: 0.98 * canvas.height
}

const FULL_RANK_TEXTAREA = {
	startX: 0.642 * canvas.width,
	startY: 0.5 * canvas.height,
	endX: 0.925 * canvas.width,
	endY: 0.544 * canvas.height
};

module.exports = function(e, btn) {
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        let area;
        switch (btn) {
                case "StartBtn":
                        area = START_BTN.area;
                        break;
                case "RestartBtn":
                        area = RESTART_BTN.area;
                        break;
                case "RankListIcon":
                        area = RANK_LIST_ICON.area;
                        break;
                case "RankListReturn":
                        area = RANK_LIST_RETURN;
			break;
		case "FullRankList":
			area = FULL_RANK_TEXTAREA;
			break;
        }
        return x >= area.startX && x <= area.endX && y >= area.startY && y <= area.endY;
}