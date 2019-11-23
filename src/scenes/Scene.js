import DataStore from "../data/DataStore.js";

export default class Scene {
    constructor() {
        this.ctx = DataStore.ctx;
    }

    update() {}

    render() {
        this.ctx.clearRect(0, 0, DataStore.screenWidth, DataStore.screenHeight);
        this.ctx.fillRect(0, 0, DataStore.screenWidth, DataStore.screenHeight);
    }
}
