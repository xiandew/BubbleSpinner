import DataStore from "../data/DataStore.js";
import Spinner from "./MainScene/Spinner.js";

export default class MainScene {
    constructor() {
        this.spinner = Spinner.getInstance();
    }

    update() {}

    render() {
        DataStore.ctx.clearRect(0, 0, DataStore.screenWidth, DataStore.screenHeight);
        DataStore.ctx.fillRect(0, 0, DataStore.screenWidth, DataStore.screenHeight);

        this.spinner.render();
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