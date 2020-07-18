import UUID from "../../base/UUID.js";
import SpinnerController from "./utils/SpinnerController.js";
import RendererManager from "../../renderer/RendererManager.js";
import Bubble from "./Bubble.js";
import DataStore from "../../data/DataStore.js";
import Score from "./Score.js";
import Health from "./Health.js";
import { SpawnedBubble } from "./NPC.js";


/**
 * Spinner logic
 */
export default class Spinner {
    static State = class {
        static ANIMATING = 1;
        static STAND = 2;
        static ROTATING = 3;
        static CRASH = 4;
    }

    constructor() {
        this.id = UUID.getUUID();
        this.angularSpeedThreshold = 0.1;
        this.angleOfRotation = 0;
        this.frictionOfRotation = 0;
        this.state = Spinner.State.ANIMATING;
        this.rendererManager = new RendererManager();

        this.controller = new SpinnerController(this);
        this.createPivot();
        this.createBubbles();
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
                let hex = neighbour,
                    coor = this.controller.hexToCoordinates(neighbour),
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

        if (other instanceof SpawnedBubble) {
            return;
        }

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
                bubble.hex.unsetObj();
                this.bubbles.splice(i, 1);
                this.rendererManager.remove(bubble);
                DataStore.MainScene.rendererManager.setRenderer(bubble, "CollisionAndGravity", other);
                Score.getInstance().addBubbleScore(bubble);
            });
        } else {
            // Wasted a shot, lose health
            Health.getInstance().loseHealth();
        }

        // Level up
        if (!this.bubbles.length) {
            DataStore.MainScene.rendererManager.setRenderer(this, "RotateOut");
            DataStore.level++;
            this.state = Spinner.State.ANIMATING;
            return;
        }

        // Init rotation
        this.state = Spinner.State.ROTATING;

        // Caculate the tangent speed of the spinner rotation
        // The tangent speed is proportional to the distance between the pivot and the linear speed line
        // The vertical distance d between the point (((x_0, y_0))) and the line (Ax + By + C = 0) is given by
        // d = |A·x_0 + B·y_0 + C| / √(A^2 + B^2)
        // y = kx + m ∴ -kx + y - m = 0 ∴ A = -k, B = 1, C = -m
        let k = other.speedY / other.speedX;
        let m = newBubble.getY() - k * newBubble.getX();
        let A = -k, B = 1, C = -m;
        let d = Math.abs(A * this.pivot.getX() + B * this.pivot.getY() + C) / Math.sqrt(A ** 2 + B ** 2);

        // The further the collision away from the pivot, the faster the rotation will be
        let scale = d / DataStore.screenWidth;
        let tangentialSpeed = other.speed * scale;

        // Get the direction of rotation
        if (other.speedX < 0 && (k * this.pivot.getX() + m) > this.pivot.getY() ||
            other.speedX > 0 && (k * this.pivot.getX() + m) < this.pivot.getY()) {
            tangentialSpeed *= (-1);
        }

        // The fewer bubbles on the spinner, the faster the rotation will be
        this.angularSpeed = tangentialSpeed / this.bubbles.length;

        // Make sure of the spinner not too fast
        this.angularSpeed = Math.sign(this.angularSpeed) * Math.min(Math.abs(this.angularSpeed), this.angularSpeedThreshold);

        console.assert(this.frictionOfRotation);
        if (Math.sign(this.angularSpeed) == Math.sign(this.frictionOfRotation)) {
            this.frictionOfRotation *= (-1);
        }
    }

    update() {
        if (this.state == Spinner.State.ANIMATING) {
            if (this.rotatedIn) {
                this.rotatedIn = false;
                DataStore.MainScene.rendererManager.setRenderer(this);
                this.state = Spinner.State.STAND;
            }
            if (this.rotatedOut) {
                this.rotatedOut = false;

                // Restart
                this.bubbles.forEach(bubble => {
                    bubble.hex.unsetObj();
                    this.rendererManager.remove(bubble);
                });

                this.createBubbles();
                DataStore.MainScene.rendererManager.setRenderer(this, "RotateIn");
            }
        }

        if (this.state == Spinner.State.ROTATING) {

            this.angularSpeed += this.frictionOfRotation;
            if (Math.sign(this.angularSpeed) == Math.sign(this.frictionOfRotation)) {
                return this.state = Spinner.State.STAND;
            }

            this.bubbles.forEach(bubble => {
                let toCentreY = bubble.getY() - this.pivot.getY();
                let toCentreX = bubble.getX() - this.pivot.getX();
                let radius = Math.sqrt(toCentreX ** 2 + toCentreY ** 2)
                let angleOfRotationInChange = Math.atan2(toCentreY, toCentreX) - this.angularSpeed;

                bubble.setX(this.pivot.getX() + Math.cos(angleOfRotationInChange) * radius);
                bubble.setY(this.pivot.getY() + Math.sin(angleOfRotationInChange) * radius);
            });
            this.angleOfRotation += this.angularSpeed;

            if (this.bubbles.some(bubble =>
                bubble.endX >= DataStore.screenWidth ||
                bubble.endY >= DataStore.screenHeight ||
                bubble.startX <= 0 ||
                bubble.startY <= 0
            )) {
                this.state = Spinner.State.CRASH;
                DataStore.openDataContext.postMessage({
                    action: "GameEnded",
                    currentScore: DataStore.score
                });
                DataStore.lastScene = DataStore.currentScene;
                DataStore.currentScene = DataStore.GameEnded.toString();
            }
        }
    }

    render(ctx) {
        this.rendererManager.render(ctx);
    }

    createPivot() {
        this.pivot = this.controller.createPivot();
        this.rendererManager.setRenderer(this.pivot);
    }

    createBubbles() {
        this.bubbles = this.controller.createBubbles();
        this.bubbles.forEach(bubble => {
            this.rendererManager.setRenderer(bubble);
        });
    }

    static getInstance() {
        if (!Spinner.instance) {
            Spinner.instance = new Spinner();
        }
        return Spinner.instance;
    }
}
