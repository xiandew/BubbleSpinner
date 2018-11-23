module.exports = function (btn, nonBackground) {
	let btnHeight;
	let btnWidth;

	if (nonBackground) {
        	btnHeight = btn.h;
        	btnWidth = btn.w;
	} else {
		btnHeight = btn.h * 2.8;
		btnWidth = btn.w + 1.5 * btnHeight;
	}
	
        return {
                startX: btn.x - btnWidth / 2,
                startY: btn.y - btnHeight / 2,
                endX: btn.x + btnWidth / 2,
                endY: btn.y + btnHeight / 2,
		w: btnWidth,
		h: btnHeight
        };
}