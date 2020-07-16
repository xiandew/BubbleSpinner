import DataStore from "../data/DataStore.js";
import Sprite from "../base/Sprite.js";

export default class Scene {
    constructor() {
        // canvas for the scene
        this.canvas = wx.createCanvas();
        this.canvas.width = DataStore.canvasWidth;
        this.canvas.height = DataStore.canvasHeight;
        this.ctx = this.canvas.getContext("2d");
        this.sprite = new Sprite(this.canvas, 0.5 * DataStore.canvasWidth, 0.5 * DataStore.canvasHeight, DataStore.canvasWidth, DataStore.canvasHeight);
    }
}
