import DataStore from "../../../data/DataStore.js";
import Sprite from "../../../base/Sprite.js";
import Spinner from "../Spinner.js";
import Bubble from "../Bubble.js";

export default class ShooterController {
    constructor(shooter) {
        this.shooter = shooter;
        this.spinner = Spinner.getInstance();
        DataStore.bottomBound = DataStore.screenHeight - 1.5 * Bubble.size;
    }

    createCurrShot() {
        return new Shot(this.shooter.nextShot ? this.shooter.nextShot.texture.img : this.createNextShot().texture.img);
    }

    // get the next shot whose asset is more likely to be the least frequent one on the spinner
    createNextShot() {
        // all possible bubble assets at current level
        let a = this.spinner.controller.getBubbleAssets();

        // bubble assets on the spinner, concat with `a`
        let b = this.spinner.bubbles.map(bubble => bubble.texture.img).concat(a);

        // the least frequent bubble in `b`
        let c = [...b.reduce((f, b) => f.set(b, (f.get(b) || 0) + 1), new Map())].reduce((a, b) => b[1] < a[1] ? b : a)[0];

        // all possible bubble assets, concat with array of `c` of the same length
        // Exploration vs exploitation
        let d = a.concat((new Array(a.length)).fill(c));

        // return a random choice from `d`
        return new Sprite(
            d[Math.floor(Math.random() * d.length)],
            0.5 * DataStore.screenWidth,
            DataStore.screenHeight - Bubble.size,
            0.5 * Bubble.size,
            0.5 * Bubble.size
        );
    }
}

class Shot extends Bubble {
    constructor(img) {
        super(img, 0.5 * DataStore.screenWidth, DataStore.bottomBound);
        // == 12.8 when screenWidth = 320 and pixelRatio = 2;
        this.speed = canvas.width * 0.02;
    }
    collideXBounds() {
        return (
            this.speedX > 0 && (this.getX() + Bubble.size / 2) >= DataStore.screenWidth ||
            this.speedX < 0 && (this.getX() - Bubble.size / 2) <= 0
        );
    }
    collideYBounds() {
        return (
            this.speedY > 0 && this.getY() >= DataStore.bottomBound ||
            this.speedY < 0 && (this.getY() - Bubble.size / 2) <= 0
        )
    }
    update() {
        this.setX(this.getX() + this.speedX);
        this.setY(this.getY() + this.speedY);
        this.setY(Math.min(this.getY(), DataStore.bottomBound));
    }
}