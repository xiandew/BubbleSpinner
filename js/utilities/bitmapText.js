export default class BitmapText {
        constructor(bitmapFont) {
                this.bitmapFont = bitmapFont;
                this.fontSize = 96;
        }

        // only for drawing a single line of numbers and not support the font colour option
        draw(ctx, text, x = 0, y = 0) {

                let fontScale = this.fontSize / this.bitmapFont.defaultSize;
                text.toString().split("").map(n => {
                        let ch = this.bitmapFont.chars[n];
                        ctx.drawImage(
                                this.bitmapFont.bitmap,
                                parseInt(ch.x),
                                parseInt(ch.y),
                                parseInt(ch.width),
                                parseInt(ch.height),
                                fontScale * parseInt(ch.xoffset) + x,
                                fontScale * parseInt(ch.yoffset) + y,
                                fontScale * parseInt(ch.width),
                                fontScale * parseInt(ch.height)
                        );
                        x += fontScale * parseInt(ch.xadvance);
                });
        }
}