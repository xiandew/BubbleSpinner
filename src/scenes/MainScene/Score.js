import DataStore from "../../data/DataStore.js";
import BitmapFont from "../../utils/BitmapFont.js";
import BitmapText from "../../utils/BitmapText.js";
import KinkubFlat from "../../../assets/bmfonts/KinkubFlat.js";
import RendererManager from "../../renderer/RendererManager.js";
import UUID from "../../base/UUID.js";
import Bubble from "./Bubble.js";

export default class Score {
    constructor() {
        this.id = UUID.getUUID();
        this.bitmapText = new BitmapText(
            new BitmapFont(DataStore.assets.get("KinkubFlat"), KinkubFlat),
        );

        this.fontSize = 0.075 * DataStore.screenWidth;
        this.x = 0.055 * DataStore.screenWidth;
        this.y = 0.165 * DataStore.screenWidth;

        this.bubbleScores = [];
        this.rendererManager = new RendererManager();
    }

    update() {
        for (let i = this.bubbleScores.length - 1; i >= 0; i--) {
            let bubbleScore = this.bubbleScores[i];
            if (bubbleScore.bubble.getY() > DataStore.screenHeight - 5 * Bubble.size) {
                this.rendererManager.setRenderer(bubbleScore, "FadeOutUp");
                this.bubbleScores.splice(i, 1);
                DataStore.score += bubbleScore.score;
            }
        }
    }

    render(ctx) {
        this.bitmapText.draw(ctx, DataStore.score, this.fontSize, this.x, this.y);
        this.rendererManager.render(ctx);
    }

    addBubbleScore(bubble) {
        this.bubbleScores.push(new BubbleScore(bubble));
    }

    static getInstance() {
        if (!Score.instance) {
            Score.instance = new Score();
        }
        return Score.instance;
    }
}

class BubbleScore extends Score {
    constructor(bubble) {
        super();
        this.bubble = bubble;
        this.score = this.getScore();
        this.fontSize = Bubble.size * 1.2;
    }

    getScore() {
        return DataStore.level <= 1 ? 1 : DataStore.level;
    }

    render(ctx) {
        this.bitmapText.draw(ctx, `+${this.score}`, this.fontSize, this.x, this.y, "center");
    }
}
