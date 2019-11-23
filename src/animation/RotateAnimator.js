import Animator from "./Animator.js";


export default class RotateAnimator extends Animator {
    constructor(target) {
        super(target);
        this.rotationAngle = 0;
        this.rotationSpeed = 0.01;
    }

    animate(ctx) {
        this.rotationAngle += this.rotationSpeed;
        ctx.save();
        ctx.translate(this.target.getX(), this.target.getY());
        ctx.rotate(this.rotationAngle);
        ctx.translate(-this.target.getX(), -this.target.getY());
        this.target.render(ctx);
        ctx.restore();
    }
}