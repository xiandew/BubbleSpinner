import Renderer from "./Renderer.js";
import RotateAnimator from "./animator/RotateAnimator.js";
import RotateOutAnimator from "./animator/RotateOutAnimator.js";
import RotateInAnimator from "./animator/RotateInAnimator.js";
import FadeOutAnimator from "./animator/FadeOutAnimator.js";
import ZoomInAnimator from "./animator/ZoomInAnimator.js";
import ZoomInUpAnimator from "./animator/ZoomInUpAnimator.js";
import TraceRenderer from "./TraceRenderer.js";
import GravityAnimator from "./animator/GravityAnimator.js";


export default class RendererManager {
    constructor() {
        this.targets = [];
        this.renderers = {};
    }

    setRenderer(target, animation = null) {
        let renderer =
            animation === "Rotate" ? new RotateAnimator(target) :
            animation === "RotateOut" ? new RotateOutAnimator(target) :
            animation === "RotateIn" ? new RotateInAnimator(target) :
            animation === "FadeOut" ? new FadeOutAnimator(target) :
            animation === "ZoomIn" ? new ZoomInAnimator(target) :
            animation === "ZoomInUp" ? new ZoomInUpAnimator(target) :
            animation === "Trace" ? new TraceRenderer(target) :
            animation === "Gravity" ? new GravityAnimator(target) :
            new Renderer(target)

        this.renderers[target.id] = renderer;

        if (!(this.targets.includes(target.id))) {
            this.targets.push(target.id);
        }
    }

    remove(target) {
        this.targets.splice(this.targets.findIndex(tid => tid === target.id), 1);
    }

    render(ctx) {
        this.targets.forEach((id) => {
            this.renderers[id].render(ctx);
        })
    }
}