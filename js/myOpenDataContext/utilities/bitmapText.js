export default class BitmapText {
        constructor(bitmapFont) {
                this.bitmapFont = bitmapFont;
                this.fontSize = 96;
        }

        // only for drawing a single line of numbers and not support the font colour option
        draw(ctx, text, x = 0, y = 0) {

		let fontScale = this.fontSize / this.bitmapFont.defaultSize;
		let charArr = text.toString().split("");

		if (this.textAlign == "center") {
			let textWidth = 0;
			charArr.forEach(n => {
				let ch = this.bitmapFont.chars[n];
				textWidth += fontScale * parseInt(ch.xadvance);
			});
			x -= 0.5 * textWidth;
		}

		if (this.textAlign == "right") {
			charArr = charArr.reverse();
		}

                charArr.map(n => {
                        let ch = this.bitmapFont.chars[n];
                        ctx.drawImage(
                                this.bitmapFont.bitmap,
                                parseInt(ch.x),
                                parseInt(ch.y),
                                parseInt(ch.width),
                                parseInt(ch.height),
				fontScale * parseInt(ch.xoffset) * (this.textAlign == "right" ? -1 : 1) + x,
                                fontScale * parseInt(ch.yoffset) + y,
                        	fontScale * parseInt(ch.width),
                                fontScale * parseInt(ch.height)
                        );
			x += fontScale * parseInt(ch.xadvance) * (this.textAlign == "right" ? -1 : 1);
                });
        }
}