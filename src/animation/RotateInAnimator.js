import Animator from "./Animator.js";

export default class RotateInAnimator extends Animator {
    constructor(target) {
        super(target);
        this.animationComplete = false;
        this.factor = 0;
        this.step = 0.02;
    }

    animate(ctx) {
        if (this.animationComplete) {
            return;
        }
        this.factor += this.step;
        this.factor = Math.min(Math.PI / 2, this.factor);

        let scale = Math.sin(this.factor);
        ctx.save();
        ctx.translate(this.target.getX(), this.target.getY());
        ctx.scale(scale, scale);
        ctx.rotate(Math.PI * 2 * scale);
        ctx.translate(-this.target.getX(), -this.target.getY());
        this.target.render(ctx);
        ctx.restore();

        if (this.factor >= Math.PI / 2) {
            this.animationComplete = true;
        }
    }
}
