export default class BitmapFont {
        constructor() {}

        loadFont(jsonData, onloaded) {

                let bitmapFont = JSON.parse(jsonData);
                this.defaultSize = Math.abs(parseInt(bitmapFont.info.size));
                this.chars = bitmapFont.chars.char;
                this.bitmap = wx.createImage();
                this.bitmap.onload = function() {
                        onloaded();
                };
                this.bitmap.src = 'js/myOpenDataContext/fonts/' + bitmapFont.pages.page.file;
        }
}