import DataStore from "../../../data/DataStore.js";
import Sprite from "../../../base/Sprite.js";
import Hex from "./Hex.js";
import HexMap from "./HexMap.js";
import Bubble from "../Bubble.js";


export default class SpinnerController {
    constructor(spinner) {
        this.spinner = spinner;
        this.bubbleAssets = this.shuffle([
            DataStore.assets.get("blue-bubble"),
            DataStore.assets.get("cyan-bubble"),
            DataStore.assets.get("red-bubble"),
            DataStore.assets.get("yellow-bubble"),
            DataStore.assets.get("pink-bubble"),
            DataStore.assets.get("green-bubble"),
        ]);

        // init spinner data
        // distance between each corner to the center in a single hex
        Hex.size = Math.ceil(0.069 * DataStore.screenWidth) / 2;

        // bubbleSize = (hexSize * 2 / √3 + hexSize * 2) / 1.9
        Bubble.size = Hex.size * (1 / Math.sqrt(3) + 1) * 2 / 1.9;

        // the number of rings for the entire map
        HexMap.radius = Math.ceil(Math.max(DataStore.screenWidth, 0.5 * DataStore.screenHeight) / Bubble.size);

        // create the hex map which covers the entire screen
        this.hexMap = HexMap.getInstance();

        this.screenCentre = { x: 0.5 * DataStore.screenWidth, y: 0.5 * DataStore.screenHeight };

        let hexCentre = this.hexMap.centre().toPixel();
        this.xOffset = this.screenCentre.x - hexCentre.x;
        this.yOffset = this.screenCentre.y - hexCentre.y;
    }

    createPivot() {
        return new Sprite(
            DataStore.assets.get("pivot"),
            this.screenCentre.x,
            this.screenCentre.y,
            Bubble.size,
            Math.sqrt((Bubble.size / 2) ** 2 - (Bubble.size / 4) ** 2) * 2
        );
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

    createBubbles() {
        let spiral = this.hexMap.cubeSpiral(this.hexMap.centre(), this.getSpiralRadius());
        
        // remove the first hex which is in the poisiton of the pivot
        spiral.shift();
        
        let bubbles = new Array(spiral.length);
        spiral.forEach((hex, i) => {
            let { x, y } = hex.toPixel();
            bubbles[i] = new Bubble(
                this.randomBubbleAsset(),
                x + this.xOffset,
                y + this.yOffset,
                Bubble.size
            );
        });

        return bubbles;
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}