export default class BitmapText {
        constructor(bitmapFont) {
                this.bitmapFont = bitmapFont;
                this.fontSize = 96;
        }

        // only for drawing a single line of numbers and not support the font colour option
        draw(ctx, text, x = 0, y = 0) {
		let startX = x;
		let startY = y;

		let fontScale = this.fontSize / this.bitmapFont.defaultSize;
		text.toString().split("").map(n => {
                        let ch = this.bitmapFont.chars[n];
                        ctx.drawImage(
                                this.bitmapFont.bitmap,
                                ch.x,
                                ch.y,
                                ch.width,
                        	ch.height,
				fontScale * ch.xoffset + x,
				fontScale * ch.yoffset + y,
				fontScale * ch.width,
				fontScale * ch.height
                        );
			x += fontScale * ch.xadvance;
                });
        }
}