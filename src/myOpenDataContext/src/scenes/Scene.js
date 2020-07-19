import DataStore from "../data/DataStore.js";
import Sprite from "../base/Sprite.js";
import BitmapText from "../utils/BitmapText.js";
import BitmapFont from "../utils/BitmapFont.js";
import KinkubFlatWhite from "../../assets/bmfonts/KinkubFlatWhite.js";

export default class Scene {
    constructor() {
        // canvas for the scene
        this.canvas = wx.createCanvas();
        this.canvas.width = DataStore.canvasWidth;
        this.canvas.height = DataStore.canvasHeight;
        this.ctx = this.canvas.getContext("2d");
        this.sprite = new Sprite(this.canvas, 0.5 * DataStore.canvasWidth, 0.5 * DataStore.canvasHeight, DataStore.canvasWidth, DataStore.canvasHeight);

        this.bitmapText = new BitmapText(new BitmapFont(DataStore.assets.get("KinkubFlatWhite"), KinkubFlatWhite));
    }

    render() {
        DataStore.ctx.clearRect(0, 0, DataStore.canvasWidth, DataStore.canvasHeight);
    }
}
