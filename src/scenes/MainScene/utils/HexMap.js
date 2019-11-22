import DataStore from "../../../data/DataStore.js";
import Hex from "./Hex.js";

export default class HexMap {
    constructor() {
        this.mapRadius = Math.ceil(Math.max(DataStore.screenWidth, 0.5 * DataStore.screenHeight) / DataStore.bubbleSize);
        this.data = new Array(2 * this.mapRadius + 1);
        for (let r = 0; r < this.data.length; r++) {
            this.data[r] = new Array(2 * this.mapRadius + 1 - Math.abs(this.mapRadius - r));
        }

        // Ref: https://www.redblobgames.com/grids/hexagons/implementation.html#org28ed58f
        for (let q = -this.mapRadius; q <= this.mapRadius; q++) {
            let r1 = Math.max(-this.mapRadius, -q - this.mapRadius);
            let r2 = Math.min(this.mapRadius, -q + this.mapRadius);
            for (let r = r1; r <= r2; r++) {
                let Q = q + this.mapRadius;
                let R = r + this.mapRadius;
                this.data[R][Q - Math.max(0, this.mapRadius - R)] = new Hex(Q, R, -Q - R);
            }
        }
    }

    map(hex) {
        return this.data[hex.r][hex.q - Math.max(0, this.mapRadius - hex.r)];
    }

    centre() {
        return this.data[this.mapRadius][this.mapRadius];
    }

    // Ref: https://www.redblobgames.com/grids/hexagons/#rings
    cubeRing(center, radius) {
        let results = [];
        let cube = this.map(Hex.add(center, Hex.scale(Hex.direction(4), radius)));
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < radius; j++) {
                if (cube) {
                    results.push(cube);
                    cube = this.map(Hex.neighbor(cube, i));
                }
            }
        }
        return results;
    }

    cubeSpiral(center, radius) {
        let results = [center];
        for (let k = 1; k <= radius; k++) {
            results = results.concat(this.cubeRing(center, k));
        }
        return results;
    }

    static getInstance() {
        if (!HexMap.instance) {
            HexMap.instance = new HexMap();
        }
        return HexMap.instance;
    }
}