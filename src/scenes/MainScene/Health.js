import DataStore from "../../data/DataStore.js";
import Bubble from "../MainScene/Bubble.js";
import RendererManager from "../../renderer/RendererManager.js";
import UUID from "../../base/UUID.js";

export default class Health {
    constructor() {
        this.id = UUID.getUUID();
        this.currHealth = this.maxHealth = 5;
        this.sprites = new Array(this.maxHealth).fill(null).map((e, i) => {
            return new Bubble(
                DataStore.assets.get("gray-bubble"),
                Bubble.size + Bubble.size * 1.05 * i,
                Bubble.size,
            )
        });

        this.rendererManager = new RendererManager();
        this.sprites.forEach(sprite => {
            this.rendererManager.setRenderer(sprite, "Rotate");
        });
    }

    render(ctx) {
        this.rendererManager.render(ctx);
    }

    loseHealth() {
        this.currHealth--;
        this.rendererManager.setRenderer(this.sprites.pop(), "FadeOut");
    }

    static getInstance() {
        if (!Health.instance) {
            Health.instance = new Health();
        }
        return Health.instance;
    }
}
