import DataStore from "../data/DataStore.js";
import Spinner from "./MainScene/Spinner.js";
import Scene from "./Scene.js";
import AnimatorController from "../animation/AnimatorController.js";

export default class MainScene extends Scene {
    constructor() {
        super();
        this.spinner = Spinner.getInstance();
        AnimatorController.registerAnimator(this.spinner, "RotateIn");
    }

    enter() {
        this.frameID = requestAnimationFrame(this.enter.bind(this));

        super.render();
        this.spinner.animator.animate(this.ctx);

        if (this.spinner.animator.animationComplete) {
            cancelAnimationFrame(this.frameID);
            this.run();
        }
    }

    update() {}

    render() {
        super.render();

        this.spinner.render(this.ctx);
    }

    // loop all the frames
    run() {
        this.frameID = requestAnimationFrame(this.run.bind(this));
        this.update();
        this.render();
    }

    static getInstance() {
        if (!MainScene.instance) {
            MainScene.instance = new MainScene();
        }
        return MainScene.instance;
    }
}