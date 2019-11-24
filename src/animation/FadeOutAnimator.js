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

        // a zoom out effect as fading out. Not visible for full-screen elements
        let scale = 2 - this.factor;
        ctx.translate(this.target.getX(), this.target.getY());
        ctx.scale(scale, scale);
        ctx.translate(-this.target.getX(), -this.target.getY());

        ctx.globalAlpha = this.factor;
        this.target.render(ctx);
        ctx.restore();

        if (this.factor == 0) {
            this.animationComplete = true;
        }
    }
}
