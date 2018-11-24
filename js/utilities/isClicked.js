import {
        START_BTN,
        RESTART_BTN,
        RANK_LIST_ICON,
        RANK_LIST_RETURN
} from '../runtime/scene';

const FULL_RANK_TEXTAREA = {
	startX:,
	startY:,
	endX:,
	endY:
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
                        area = RANK_LIST_RETURN.area;
			break;
        }
        return x >= area.startX && x <= area.endX && y >= area.startY && y <= area.endY;
}