export default class TouchHandler {
    constructor () {}

    onTouchStart(callback) {
        this.tsHandler = callback;
        wx.onTouchStart(this.tshandler);
    }

    onTouchMove(callback) {
        this.tmHandler = callback;
        wx.onTouchMove(this.tmHandler);
    }

    onTouchEnd(callback) {
        this.teHandler = callback;
        wx.onTouchEnd(this.teHandler);
    }

    destroy() {
        wx.offTouchStart(this.tsHandler);
        wx.offTouchMove(this.tmHandler);
        wx.offTouchEnd(this.teHandler);
    }
}

