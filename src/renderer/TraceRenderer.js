import Renderer from "./Renderer.js";
import Bubble from "../scenes/MainScene/Bubble.js";
import DataStore from "../data/DataStore.js";

export default class TraceRenderer extends Renderer {
    constructor(target) {
        super(target);
    }

    render(ctx) {
        if (!this.target.renderTrace) {
            return;
        }

        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,128,0,0.2)";
        ctx.lineWidth = Bubble.size;
        ctx.lineCap = "round";

        ctx.moveTo(DataStore.screenWidth * 0.5, DataStore.bottomBound);
        ctx.lineTo(this.target.touchX, this.target.touchY);

        ctx.stroke();
        ctx.closePath();
    }
}
