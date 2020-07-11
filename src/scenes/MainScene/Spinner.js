import UUID from "../../base/UUID.js";
import SpinnerController from "./utils/SpinnerController.js";
import RendererManager from "../../renderer/RendererManager.js";
import Bubble from "./Bubble.js";

/**
 * Spinner logic
 */
export default class Spinner {
    constructor() {
        this.id = UUID.getUUID();
        this.controller = new SpinnerController();
        this.pivot = this.controller.createPivot();
        this.bubbles = this.controller.createBubbles();

        this.rendererManager = new RendererManager();
        this.rendererManager.setRenderer(this.pivot);
        this.bubbles.forEach(bubble => {
            this.rendererManager.setRenderer(bubble);
        });

        this.angleOfRotation = 0;
    }

    getX() {
        return this.pivot.x;
    }

    getY() {
        return this.pivot.y;
    }



    collides(other) {
        for (let bubble of Array.from(this.bubbles).concat(this.pivot)) {
            if (bubble.collides(other)) {
                this.onCollision(bubble, other);
                return true;
            }
        }
        return false;
    }

    onCollision(bubble, other) {
        // Adjust the bubble that collides the spinner to the closest hex
        let neighbouringHexes = this.controller.getAdjacentHexes(bubble.hex).map(neighbour => {
            if (neighbour && !neighbour.obj) {
                let hexToCoordinate = (hex) => {
                    let { x, y } = hex.toPixel();
                    x += this.controller.xOffset;
                    y += this.controller.yOffset;

                    let toCentreX = x - this.getX();
                    let toCentreY = y - this.getY();
                    let radius = Math.sqrt(toCentreX ** 2 + toCentreY ** 2)
                    let angle = Math.atan2(toCentreY, toCentreX) - this.angleOfRotation;

                    return {
                        x: this.getX() + Math.cos(angle) * radius,
                        y: this.getY() + Math.sin(angle) * radius
                    }
                };

                let hex = neighbour,
                    coor = hexToCoordinate(neighbour),
                    sortCrit = (other.getX() - coor.x) ** 2 + (other.getY() - coor.y) ** 2;
                return { hex, coor, sortCrit };
            }
            return null;
        }).filter(e => !!e);
        neighbouringHexes.sort((a, b) => {
            return a.sortCrit - b.sortCrit;
        });
        if (!neighbouringHexes.length) {
            return;
        }

        let closestHex = neighbouringHexes[0];
        let newBubble = new Bubble(
            other.texture.img,
            closestHex.coor.x,
            closestHex.coor.y
        );
        closestHex.hex.setObj(newBubble);
        this.bubbles.push(newBubble);
        this.rendererManager.setRenderer(newBubble);

        // Find same bubbles
        let sameBubbles = ((rootBubble) => {
            let found = [];
            let visited = [];
            let fringes = [[rootBubble]];

            while (true) {
                fringes.push([]);

                fringes[fringes.length - 2].forEach(bubble => {
                    this.controller.getAdjacentHexes(bubble.hex).forEach(hex => {
                        let bubble = hex.obj;
                        if (bubble && !visited.includes(bubble)) {
                            visited.push(bubble);
                            if (bubble.texture.img == rootBubble.texture.img) {
                                found.push(bubble);
                                fringes[fringes.length - 1].push(bubble);
                            }
                        }
                    });
                });

                if (!fringes[fringes.length - 1].length) {
                    break;
                }
            }

            return found;
        })(newBubble);

        if (sameBubbles.length >= 3) {

            // Find same bubbles and floating bubbles
            let sameOrFloatingBubbles = (() => {
                let found = [];
                let visited = [];
                let fringes = [[this.pivot]];

                while (true) {
                    fringes.push([]);

                    fringes[fringes.length - 2].forEach(bubble => {
                        this.controller.getAdjacentHexes(bubble.hex).forEach(hex => {
                            let bubble = hex.obj;
                            if (bubble && !visited.includes(bubble) && !sameBubbles.includes(bubble)) {
                                visited.push(bubble);
                                fringes[fringes.length - 1].push(bubble);
                            }
                        });
                    });

                    if (!fringes[fringes.length - 1].length) {
                        break;
                    }
                }

                this.bubbles.forEach(bubble => {
                    if (!visited.includes(bubble)) {
                        found.push(bubble);
                    }
                });

                return found;
            })();

            // Remove same bubbles and floating bubbles from the spinner
            sameOrFloatingBubbles.forEach(bubble => {
                let i = this.bubbles.indexOf(bubble);
                console.assert(i >= 0);

                // Remove bubble from the spinner
                this.bubbles.splice(i, 1);
                this.rendererManager.setRenderer(bubble, "CollisionAndGravity", other);
            });
        } else {
            // Reduce health
        }

        // Rotate the spinner
        // ...
    }

    update() {
        // this.angleOfRotation += 0.001;
    }

    render(ctx) {
        this.rendererManager.render(ctx);
    }

    static getInstance() {
        if (!Spinner.instance) {
            Spinner.instance = new Spinner();
        }
        return Spinner.instance;
    }
}
