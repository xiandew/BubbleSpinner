import {
        START_BTN,
        RANK_LIST_ICON
} from '../runtime/scene';

const RANK_LIST_RETURN = {
	startX: 0.08 * canvas.width,
	startY: 0.9 * canvas.height,
	endX: 0.16 * canvas.width,
	endY: 0.98 * canvas.height
}

const RESTART_BTN_AREA = {
	startX: 0.2679 * canvas.width,
	endX: 0.7321 * canvas.width,
	startY: 0.75 * canvas.height - 0.07 * canvas.width,
	endY: 0.75 * canvas.height + 0.07 * canvas.width
}

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
		case "RestartButton":
			area = RESTART_BTN_AREA;
        }
        return x >= area.startX && x <= area.endX && y >= area.startY && y <= area.endY;
}