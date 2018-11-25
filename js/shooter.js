import GameInfo, {
        BALLS,
        BALL_SIZE
} from './runtime/gameInfo';
import Hole from './hole';
import Sprite from './sprite';

let isCollideSpiral = require("./utilities/isCollideSpiral");
let newImage = require("./utilities/newImage");
let gameInfo = new GameInfo();
let ctx = canvas.getContext('2d');

const NEXT_SHOOTER_SIZE = 0.5 * BALL_SIZE;
const NEXT_SHOOTER_X = 0.5 * canvas.width - 0.5 * NEXT_SHOOTER_SIZE;
const NEXT_SHOOTER_Y = canvas.height - BALL_SIZE;
const BOTTOM_BOUND = canvas.height - 1.5 * BALL_SIZE;

export const LINEAR_SPEED = 15;

/*----------------------------------------------------------------------------*/

// for drawing the arrow
let headAngle;
let headLength;

let nextShooterImg;
let nextShooterSize;

let delta;

export default class Shooter extends Sprite {
        constructor() {
                super();
                this.initShooter();
        }

        initShooter() {
                this.shown = false;
                this.touched = false;
                this.shooting = false;
                this.dropping = false;
                this.bounces = 0;

                // for animation
                this.acc = 0;

                this.width = this.height = NEXT_SHOOTER_SIZE;

                this.x = canvas.width / 2;
                this.y = NEXT_SHOOTER_Y;

                this.img.src = this.nextShooterSrc ? this.nextShooterSrc : this.randomBall();
                this.nextShooterSrc = this.randomBall();
        }

        randomBall() {
                return BALLS[Math.floor(Math.random() * BALLS.length)];
        }

        addEvents() {
                !this.touchstarter ? this.touchstarter = this.touchstartHandler.bind(this) : true;
                !this.touchmover ? this.touchmover = this.touchmoveHandler.bind(this) : true;
                !this.touchender ? this.touchender = this.touchendHandler.bind(this) : true;
                canvas.addEventListener('touchstart', this.touchstarter);
                canvas.addEventListener('touchmove', this.touchmover);
                canvas.addEventListener('touchend', this.touchender);

                this.hasEventBind = true;
        }

        removeEvents() {
                canvas.removeEventListener('touchstart', this.touchstarter);
                canvas.removeEventListener('touchmove', this.touchmover);
                canvas.removeEventListener('touchend', this.touchender);

                this.hasEventBind = false;
        }

        touchstartHandler(e) {
                e.preventDefault();
                if (!this.shooting && !this.dropping) {
                        this.touched = true;
                        this.touchX = e.touches[0].clientX;
                        this.touchY = e.touches[0].clientY;
                }
        }
        touchmoveHandler(e) {
                e.preventDefault();
                if (!this.shooting && this.touched) {
                        this.touchX = e.touches[0].clientX;
                        this.touchY = e.touches[0].clientY;
                }
        }
        touchendHandler(e) {
                e.preventDefault();
                if (!this.shooting && this.touched) {
                        this.touched = false;
                        this.initSpeed();
                        this.shooting = true;
                }
        }

        render() {
                !this.shown ? this.showup() : this.display();
        }

        showup() {
                if (this.acc >= Math.PI / 2) {
                        this.acc = Math.PI / 2;
                        this.shown = true;
                }

                delta = Math.sin(this.acc) * BALL_SIZE * 0.5;
                this.y = NEXT_SHOOTER_Y - delta;
                this.width = this.height = NEXT_SHOOTER_SIZE + delta;

                nextShooterImg = newImage(this.nextShooterSrc);
                nextShooterSize = NEXT_SHOOTER_SIZE * Math.sin(this.acc);
                ctx.drawImage(
                        nextShooterImg,
                        0.5 * canvas.width - 0.5 * nextShooterSize,
                        canvas.height - Math.sin(this.acc) * BALL_SIZE,
                        nextShooterSize,
                        nextShooterSize
                );

                this.display();

                this.acc += 0.05;
        }

        display() {

                if (this.shown) {
                        ctx.drawImage(
                                nextShooterImg,
                                NEXT_SHOOTER_X,
                                NEXT_SHOOTER_Y,
                                NEXT_SHOOTER_SIZE,
                                NEXT_SHOOTER_SIZE);

                        this.touched ? this.renderArrow() : true;
                }

                super.render();
        }

        update(spiral) {
                if ((!this.shown) || (!this.shooting)) {
                        return;
                }
                let bounced = false;

                if (this.speedX > 0 && (this.x + this.width / 2) >= canvas.width ||
                        this.speedX < 0 && (this.x - this.width / 2) <= 0) {

                        !bounced ? (this.bounces++, bounced = true) : true;
                        this.speedX *= (-1);
                }
                if (this.speedY > 0 && this.y >= BOTTOM_BOUND ||
                        this.speedY < 0 && (this.y - this.height / 2) <= 0) {

                        !bounced ? (this.bounces++, bounced = true) : true;
                        this.speedY *= (-1);

                        this.dropping ? this.speedY *= 0.7 : true;
                }


                this.dropping ? (this.speedX *= 0.998, this.speedY += 1) : true;

                this.x += this.speedX;
                this.y += this.speedY;

                this.y >= BOTTOM_BOUND ? this.y = BOTTOM_BOUND : true;

                if (isCollideSpiral(this)) {
                        this.shooting = false;
                        spiral.onCollision(this);
                        return;
                }

                if (this.bounces >= 8 && !this.dropping) {
                        // reset the speed for dropping effect
                        this.speedX = 2.5 * (this.speedX > 0 ? 1 : -1);
                        this.dropping = true;
                }

                if (this.dropping) {
                        // 0.588235.. is the asymptotic value of the y speed by experimenting
                        if (Math.abs(this.x - canvas.width / 2) < 1 && Math.abs(0.5883 - this.speedY) < 0.0001) {
                                this.x = canvas.width / 2;
                                this.y = BOTTOM_BOUND

                                this.dropping = false;
                                this.shooting = false;
                                this.bounces = 0;
                        }
                }
        }

        initSpeed() {
                let angle = Math.atan2(this.touchY - this.y, this.touchX - this.x);
                this.speedX = LINEAR_SPEED * Math.cos(angle);
                this.speedY = LINEAR_SPEED * Math.sin(angle);
        }

        renderArrow() {
                headLength = 10;
                headAngle = Math.atan2(this.touchY - this.y, this.touchX - this.x);

                ctx.beginPath();
                ctx.strokeStyle = 'green';

                // from start point
                ctx.moveTo(this.x, this.y);

                // to touch point 
                ctx.lineTo(this.touchX, this.touchY);

                // form a little triangle for the arrow head
                // from touch point to right side of the head
                ctx.lineTo(this.touchX - headLength * Math.cos(headAngle - Math.PI / 6),
                        this.touchY - headLength * Math.sin(headAngle - Math.PI / 6));
                // to bottom side of the head
                ctx.lineTo(this.touchX - headLength * Math.cos(headAngle + Math.PI / 6),
                        this.touchY - headLength * Math.sin(headAngle + Math.PI / 6));
                // back to the touch point
                ctx.lineTo(this.touchX, this.touchY);

                ctx.stroke();
                ctx.closePath();
        }

}