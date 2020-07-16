import Assets from './Assets.js';

export default class AssetsLoader {
    constructor(assets = Assets) {
        this.assets = new Map(assets);
        for (let [key, value] of this.assets) {
            const image = wx.createImage();
            image.src = value;
            this.assets.set(key, image);
        }
    }

    onLoaded(callback) {
        let loadedCount = 0;
        for (let asset of this.assets.values()) {
            asset.onload = () => {
                loadedCount++;
                if (loadedCount >= this.assets.size) {
                    callback(this.assets);
                }
            }
        }
    }

    static getInstance() {
        if (!AssetsLoader.instance) {
            AssetsLoader.instance = new AssetsLoader()
        }
        return AssetsLoader.instance;
    }
}