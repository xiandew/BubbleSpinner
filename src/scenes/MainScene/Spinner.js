import DataStore from "../../data/DataStore.js";
import Sprite from "../../base/Sprite.js";
import HexMap from "./utils/HexMap.js";
import Bubble from "./utils/Bubble.js";


export default class Spinner {
    constructor() {
        this.pivot = new Sprite(
            DataStore.assets.get("pivot"),
            0.5 * DataStore.screenWidth,
            0.5 * DataStore.screenHeight,
            DataStore.bubbleSize,
            Math.sqrt((DataStore.bubbleSize / 2) ** 2 - (DataStore.bubbleSize / 4) ** 2) * 2
        );

        this.bubbleAssets = shuffle([
            DataStore.assets.get("blue-bubble"),
            DataStore.assets.get("cyan-bubble"),
            DataStore.assets.get("red-bubble"),
            DataStore.assets.get("yellow-bubble"),
            DataStore.assets.get("pink-bubble"),
            DataStore.assets.get("green-bubble"),
        ]);

        this.hexMap = HexMap.getInstance();
        let { x, y } = this.hexMap.centre().toPixel(DataStore.hexSize);
        this.xOffset = this.pivot.x - x;
        this.yOffset = this.pivot.y - y;

        this.createbubbles();
    }

    getSpiralRadius() {
        let r = [2, 3, 4, 5, 6];
        return DataStore.level < r.length ? r[DataStore.level] : r[r.length - 1];
    }

    getBubbleAssets() {
        return this.bubbleAssets.slice(0, this.getSpiralRadius() + 1);
    }

    randomBubbleAsset() {
        let bubbleAssets = this.getBubbleAssets();
        return bubbleAssets[Math.floor(Math.random() * bubbleAssets.length)];
    }

    createbubbles() {
        this.spiral = this.hexMap.cubeSpiral(this.hexMap.centre(), this.getSpiralRadius());
        this.spiral.shift();
        this.bubbles = new Array(this.spiral.length);
        this.spiral.forEach((hex, i) => {
            let { x, y } = hex.toPixel(DataStore.hexSize);
            this.bubbles[i] = new Bubble(
                this.randomBubbleAsset(),
                x + this.xOffset,
                y + this.yOffset,
                DataStore.bubbleSize
            );
        });
    }

    render() {
        this.pivot.render(DataStore.ctx);
        this.bubbles.forEach(b => b.render(DataStore.ctx));
    }

    static getInstance() {
        if (!Spinner.instance) {
            Spinner.instance = new Spinner();
        }
        return Spinner.instance;
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
