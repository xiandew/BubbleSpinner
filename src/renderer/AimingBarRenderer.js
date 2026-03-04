import Renderer from "./Renderer.js";
import Bubble from "../scenes/MainScene/Bubble.js";
import DataStore from "../data/DataStore.js";
import Shooter from "../scenes/MainScene/Shooter.js";

export default class AimingBarRenderer extends Renderer {
    constructor(target) {
        super(target);

        this.canvas = wx.createCanvas();
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;

        this.ctx = this.canvas.getContext("2d");
        this.ctx.scale(DataStore.pixelRatio, DataStore.pixelRatio);
    }

    render(ctx) {
        if (this.target.state != Shooter.State.AIMING) {
            return;
        }

        const startX = DataStore.screenWidth * 0.5;
        const startY = DataStore.bottomBound;
        const endX = this.target.touchX;
        const endY = this.target.touchY;

        const dx = endX - startX;
        const dy = endY - startY;
        const totalDist = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / totalDist;
        const ny = dy / totalDist;

        const step = Bubble.size;
        const dots = [
            { dist: step * 1, radius: Bubble.size * 0.30 },
            { dist: step * 2, radius: Bubble.size * 0.20 },
            { dist: step * 3, radius: Bubble.size * 0.10 },
        ];

        this.ctx.fillStyle = "rgba(0, 128, 0, 0.5)";
        for (const { dist, radius } of dots) {
            if (dist >= totalDist) break;
            const x = startX + nx * dist;
            const y = startY + ny * dist;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
        }

        ctx.drawImage(this.canvas, 0, 0, DataStore.screenWidth, DataStore.screenHeight);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
