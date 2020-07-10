import DataStore from "../../data/DataStore.js";
import BitmapFont from "../../utils/BitmapFont.js";
import BitmapText from "../../utils/BitmapText.js";
import Konstructiv from "../../../assets/bmfonts/Konstructiv.js";
import RendererManager from "../../renderer/RendererManager.js";
import UUID from "../../base/UUID.js";

export default class Score {
    constructor() {
        this.id = UUID.getUUID();
        this.bitmapText = new BitmapText(
            new BitmapFont(DataStore.assets.get("Konstructiv"), Konstructiv),
        );

        this.fontSize = 0.075 * DataStore.screenWidth;
        this.startX = 0.055 * DataStore.screenWidth;
        this.startY = 0.165 * DataStore.screenWidth;
    }

    render(ctx) {
        this.bitmapText.draw(ctx, DataStore.score, this.fontSize, this.startX, this.startY);
    }

    static getInstance() {
        if (!Score.instance) {
            Score.instance = new Score();
        }
        return Score.instance;
    }
}