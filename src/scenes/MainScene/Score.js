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
        this.y = DataStore.menuButtonCenterY + Bubble.size;

        this.bubbleScores = [];
        this.rendererManager = new RendererManager();
    }

    update() {
        for (let i = this.bubbleScores.length - 1; i >= 0; i--) {
            let bubbleScore = this.bubbleScores[i];
            if (bubbleScore.bubble.getY() > DataStore.screenHeight - 5 * Bubble.size) {
                this.bubbleScores.splice(i, 1);
                if (DataStore.currentScene === DataStore.MainScene.toString()) {
                    this.rendererManager.setRenderer(bubbleScore, "FadeOutUp");
                    DataStore.score += bubbleScore.score;
                }
            }
        }
    }

    render(ctx) {
        this.bitmapText.draw(ctx, DataStore.score, this.fontSize, this.x, this.y);
        this.rendererManager.render(ctx);
    }

    addBubbleScore(bubble) {
        this.bubbleScores.push(new BubbleScore(bubble, this.bitmapText, this.x, this.y));
    }

    static getInstance() {
        if (!Score.instance) {
            Score.instance = new Score();
        }
        return Score.instance;
    }
}

// Map bubble image-name prefix → a lighter tint colour
const BUBBLE_TINT = {
    blue:   "rgba(140, 195, 255, 0.95)",
    cyan:   "rgba(100, 225, 235, 0.95)",
    red:    "rgba(255, 145, 145, 0.95)",
    yellow: "rgba(255, 230, 110, 0.95)",
    pink:   "rgba(255, 175, 210, 0.95)",
    green:  "rgba(140, 225, 140, 0.95)",
    gray:   "rgba(200, 200, 200, 0.95)",
};

function bubbleTint(bubble) {
    const src = bubble.texture.img.src || "";
    const match = src.match(/(blue|cyan|red|yellow|pink|green|gray)-bubble/);
    return match ? (BUBBLE_TINT[match[1]] || "rgba(255,255,255,0.95)") : "rgba(255,255,255,0.95)";
}

class BubbleScore {
    constructor(bubble, bitmapText, x, y) {
        this.id    = UUID.getUUID();
        this.bubble = bubble;
        this.bitmapText = bitmapText;
        this.x     = x;
        this.y     = y;
        this.score = DataStore.level + 1;
        this.fontSize = Bubble.size * 1.2;
        this.color = bubbleTint(bubble);
    }

    render(ctx) {
        this.bitmapText.drawTinted(ctx, `+${this.score}`, this.color, this.fontSize, this.x, this.y, "center");
    }
}
