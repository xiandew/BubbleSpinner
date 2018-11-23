export default class BitmapFont {
        constructor() {}

        loadFont(jsonPath, onloaded) {
                let fs = wx.getFileSystemManager();
                fs.readFile({
                        filePath: jsonPath,
                        encoding: "utf-8",
                        success: res => {
                                let bitmapFont = JSON.parse(res.data);
				this.defaultSize = Math.abs(parseInt(bitmapFont.info.size));
                                this.chars = bitmapFont.chars.char;
                                this.bitmap = wx.createImage();
                                this.bitmap.onload = function() {
                                        onloaded();
                                };
                                this.bitmap.src = "fonts/" + bitmapFont.pages.page.file;
                        }
                });
        }
}