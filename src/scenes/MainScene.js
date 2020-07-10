import DataStore from "../data/DataStore.js";
import RendererManager from "../renderer/RendererManager.js";
import Spinner from "./MainScene/Spinner.js";
import Shooter from "./MainScene/Shooter.js";
import Scene from "./Scene.js";
import Health from "./MainScene/Health.js";


export default class MainScene extends Scene {
    constructor() {
        super();
        this.spinner = Spinner.getInstance();
        this.shooter = Shooter.getInstance();
        this.health = Health.getInstance();

        this.rendererManager = new RendererManager();
        this.rendererManager.setRenderer(this.spinner, "RotateIn");
        this.rendererManager.setRenderer(this.shooter);
        this.rendererManager.setRenderer(this.health);
    }

    update() {
        this.shooter.update();
        this.spinner.update();
    }

    render() {
        super.render();
        this.rendererManager.render(this.ctx);
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
