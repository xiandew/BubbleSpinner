import Renderer from "./Renderer.js";
import RotateAnimator from "./animator/RotateAnimator.js";
import RotateOutAnimator from "./animator/RotateOutAnimator.js";
import RotateInAnimator from "./animator/RotateInAnimator.js";
import FadeOutAnimator from "./animator/FadeOutAnimator.js";
import ZoomInAnimator from "./animator/ZoomInAnimator.js";
import ZoomInUpAnimator from "./animator/ZoomInUpAnimator.js";
import TraceRenderer from "./TraceRenderer.js";
import GravityAndBounceAnimator from "./animator/GravityAndBounceAnimator.js";
import CollisionAndGravityAnimator from "./animator/CollisionAndGravityAnimator.js";
import FadeOutUpAnimator from "./animator/FadeOutUpAnimator.js";


export default class RendererManager {
    constructor() {
        this.targets = [];
        this.renderers = {};
    }

    setRenderer(target, animation = null, ...args) {
        // console.assert(target.id);
        let renderer =
            animation === "Rotate" ? new RotateAnimator(target) :
            animation === "RotateOut" ? new RotateOutAnimator(target) :
            animation === "RotateIn" ? new RotateInAnimator(target) :
            animation === "FadeOut" ? new FadeOutAnimator(target) :
            animation === "ZoomIn" ? new ZoomInAnimator(target) :
            animation === "ZoomInUp" ? new ZoomInUpAnimator(target) :
            animation === "Trace" ? new TraceRenderer(target) :
            animation === "GravityAndBounce" ? new GravityAndBounceAnimator(target) :
            animation === "CollisionAndGravity" ? new CollisionAndGravityAnimator(target, ...args) :
            animation === "FadeOutUp" ? new FadeOutUpAnimator(target) :
            new Renderer(target)

        this.renderers[target.id] = renderer;

        if (!(this.targets.includes(target.id))) {
            // Prepend the new target as we are gonna render the targets in reverse order
            this.targets.unshift(target.id);
        }
    }

    remove(target) {
        this.targets.splice(this.targets.findIndex(tid => tid === target.id), 1);
        this.renderers[target.id] = null;
    }

    render(ctx) {
        for (let i = this.targets.length - 1; i >= 0; i--) {
            let renderer = this.renderers[this.targets[i]];
            if (renderer.outOfSight) {
                this.remove(renderer.target);
            } else {
                renderer.render(ctx);
            }
        }
    }
}