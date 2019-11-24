import SpinnerController from "./utils/SpinnerController.js";


export default class Spinner {
    constructor() {
        this.controller = new SpinnerController(this);
        this.pivot = this.controller.createPivot();
        this.bubbles = this.controller.createBubbles();
    }

    getX() {
        return this.pivot.x;
    }

    getY() {
        return this.pivot.y;
    }

    render(ctx) {
        this.pivot.render(ctx);
        this.bubbles.forEach(b => b.render(ctx));
    }

    static getInstance() {
        if (!Spinner.instance) {
            Spinner.instance = new Spinner();
        }
        return Spinner.instance;
    }
}
