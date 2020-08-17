import DataStore from "../../data/DataStore.js";
import BitmapFont from "../../utils/BitmapFont.js";
import BitmapText from "../../utils/BitmapText.js";
import DustyPro from "../../../assets/bmfonts/DustyPro.js";
import RendererManager from "../../renderer/RendererManager.js";
import UUID from "../../base/UUID.js";
import Bubble from "./Bubble.js";

export default class Score {
    constructor() {
        this.id = UUID.getUUID();
        this.bitmapText = new BitmapText(
            new BitmapFont(DataStore.assets.get("DustyPro"), DustyPro),
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
                this.bubbleScores.splice(i, 1);
                if (DataStore.currentScene === DataStore.MainScene.toString()) {
                    DataStore.score += bubbleScore.getScore();
                    this.rendererManager.setRenderer(bubbleScore, "FadeOutUp");
                }
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
    static thresholdUnit = 100;

    constructor(bubble) {
        super();
        this.bubble = bubble;
        this.fontSize = Bubble.size * 1.2;

        // In case the adding of the bubble score happens after levelling up
        this.level = DataStore.level;
    }

    getScore() {
        let getThreshold = (scaledScore) => {
            return [...Array(scaledScore + 1).keys()].reduce((a, c) => a + c * BubbleScore.thresholdUnit, 0);
        }

        /**
         *
         * @param {*} scaledScore 
         * @param {*} threshold =
         *  Lv0: 100
         *  Lv1: 100 + 200 + 100
         *  Lv2: 100 + 200 + 300 + 200 + 100
         */
        let getScaledScore = (scaledScore, threshold) => {
            if (!scaledScore || DataStore.score < threshold) {
                return scaledScore;
            } else {
                return getScaledScore(scaledScore - 1, threshold + (scaledScore - 1) * BubbleScore.thresholdUnit);
            }
        }

        this.score = getScaledScore(this.level + 1, getThreshold(this.level + 1));
        return this.score;
    }

    render(ctx) {
        this.bitmapText.draw(ctx, `+${this.score}`, this.fontSize, this.x, this.y, "center");
    }
}
