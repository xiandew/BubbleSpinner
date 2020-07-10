import DataStore from "../../data/DataStore.js";
import BitmapFont from "../../utils/BitmapFont.js";
import BitmapText from "../../utils/BitmapText.js";
import Konstructiv from "../../../assets/bmfonts/Konstructiv.js";
import RendererManager from "../../renderer/RendererManager.js";

export default class Score {
    constructor() {
        this.bitmapText = new BitmapText(
            new BitmapFont(DataStore.assets.get("Konstructiv")),
            Konstructiv
        );

        this.floatingScores = [];
        this.rendererManager = new RendererManager();
    }

    render(ctx) {
        this.floatingScores.forEach(score => {
            if (score.fadedOutUp) {
                this.rendererManager.remove(score);
            }
        });
        this.rendererManager.render(ctx);
    }

    addFloatingScores(text, x, y) {
        this.floatingScores.push({text, x, y});
    }

    static getInstance() {
        if (!Score.instance) {
            Score.instance = new Score();
        }
        return Score.instance;
    }
}