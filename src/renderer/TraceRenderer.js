import Renderer from "./Renderer.js";
import Bubble from "../scenes/MainScene/Bubble.js";
import DataStore from "../data/DataStore.js";

export default class TraceRenderer extends Renderer {
    constructor(target) {
        super(target);

        this.canvas = wx.createCanvas();
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;

        this.ctx = this.canvas.getContext("2d");
        this.ctx.scale(DataStore.pixelRatio, DataStore.pixelRatio);
        this.ctx.lineWidth = Bubble.size;
        this.ctx.lineCap = "round";
    }

    render(ctx) {
        if (!this.target.renderTrace) {
            return;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(DataStore.screenWidth * 0.5, DataStore.bottomBound);
        this.ctx.lineTo(this.target.touchX, this.target.touchY);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.globalCompositeOperation = 'source-in';

        this.ctx.fillStyle = "rgba(0, 128, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = "source-over";

        ctx.drawImage(this.canvas, 0, 0, DataStore.screenWidth, DataStore.screenHeight);
    }
}
