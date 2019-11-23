import Animator from "./Animator.js";

export default class FadeOutAnimator extends Animator {
    constructor(target) {
        super(target);
        this.animationComplete = false;
        this.factor = 1;
        this.step = 0.1;
    }

    animate(ctx) {
        if (this.animationComplete) {
            return;
        }

        this.factor -= this.step;
        this.factor = Math.max(0, this.factor);

        ctx.save();
        ctx.globalAlpha = this.factor;
        this.target.render(ctx);
        ctx.restore();

        if (this.factor == 0) {
            this.animationComplete = true;
        }
    }
}
