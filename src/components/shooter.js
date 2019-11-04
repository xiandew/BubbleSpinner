import GameInfo from '../runtime/gameInfo';
import Sprite from './base/sprite';
import Hole from './hole';

let gameInfo = GameInfo.getInstance();
let ctx = canvas.getContext('2d');

// Make the shooter singleton
let instance;

/*----------------------------------------------------------------------------*/

let newImage = require("../utilities/newImage");
let randomBall = require("../utilities/randomBall");
let isCollideSpiral = require("../utilities/isCollideSpiral");

/*----------------------------------------------------------------------------*/

let ballSize = gameInfo.getBallSize();
let shooterSpeed = gameInfo.getShooterSpeed();

const NEXT_SHOOTER_SIZE = 0.5 * ballSize;
const NEXT_SHOOTER_X = 0.5 * gameInfo.canvasWidth - 0.5 * NEXT_SHOOTER_SIZE;
const NEXT_SHOOTER_Y = gameInfo.canvasHeight - ballSize;
const BOTTOM_BOUND = gameInfo.canvasHeight - 1.5 * ballSize;

/*----------------------------------------------------------------------------*/

// for drawing the arrow
let headAngle;
let headLength;

let nextShooterSrc;
let nextShooterImg;
let nextShooterSize;

let delta;

/*----------------------------------------------------------------------------*/

export default class Shooter extends Sprite {
        constructor() {
                super();
                this.initShooter();
        }

        static getInstance() {
                if (!instance) {
                        instance = new Shooter();
                }
                return instance;
        }

        initShooter() {
                this.shown = false;
                this.touched = false;
                this.shooting = false;
                this.dropping = false;
                this.bounces = 0;

                // for animation
                this.acc = 0;

                this.size = NEXT_SHOOTER_SIZE;

                this.x = gameInfo.canvasWidth / 2;
                this.y = NEXT_SHOOTER_Y;

                this.imgSrc =
                        gameInfo.getBallsSrc().includes(nextShooterSrc) ?
                        nextShooterSrc :
                        randomBall();
                nextShooterSrc = randomBall();
                nextShooterImg = newImage(nextShooterSrc);
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
                if (!this.shooting && !this.dropping && gameInfo.lives) {
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

                delta = Math.sin(this.acc) * ballSize * 0.5;
                this.y = NEXT_SHOOTER_Y - delta;
                this.size = NEXT_SHOOTER_SIZE + delta;
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
                                NEXT_SHOOTER_SIZE
                        );
                        if (this.touched) {
                                this.renderArrow();
                        }
                } else {
                        nextShooterSize = NEXT_SHOOTER_SIZE * Math.sin(this.acc);
                        ctx.drawImage(
                                nextShooterImg,
                                gameInfo.canvasWidth * 0.5 - nextShooterSize * 0.5,
                                gameInfo.canvasHeight - Math.sin(this.acc) * ballSize,
                                nextShooterSize,
                                nextShooterSize
                        );
                }
                super.render();
        }

        update(spiral) {
                if (!this.shown || !this.shooting) {
                        return;
                }
                // for counting number of bounces. Only count once
                // when changing both speedX and speedY.
                let bounced = false;

                if (this.speedX > 0 && (this.x + this.size / 2) >= gameInfo.canvasWidth ||
                        this.speedX < 0 && (this.x - this.size / 2) <= 0) {
                        !bounced ? (this.bounces++, bounced = true) : true;
                        this.speedX *= (-1);
                }
                if (this.speedY > 0 && this.y >= BOTTOM_BOUND ||
                        this.speedY < 0 && (this.y - this.size / 2) <= 0) {
                        !bounced ? (this.bounces++, bounced = true) : true;
                        this.speedY *= (-1);

                        // gravity effects
                        this.dropping ? this.speedY *= 0.7 : true;
                }

                // gravity effects
                this.dropping ? (this.speedX *= 0.998, this.speedY += 1) : true;

                this.x += this.speedX;
                this.y += this.speedY;

                this.y >= BOTTOM_BOUND ? this.y = BOTTOM_BOUND : true;

                // for finding a closest hole
                if (isCollideSpiral(this)) {
                        spiral.onCollision();
                        this.shooting = false;
                        return;
                }

                if (this.bounces >= 8 && !this.dropping && this.speedY < 0) {
                        // reset the speed for dropping effect
                        this.speedX = 2.5 * (this.speedX > 0 ? 1 : -1);
                        this.dropping = true;
                }

                if (this.dropping) {
                        // 0.588235.. is the asymptotic value of the y speed by experimenting
                        if (Math.abs(this.x - gameInfo.canvasWidth / 2) < 1 &&
                                Math.abs(0.5883 - this.speedY) < 0.0001) {
                                this.x = gameInfo.canvasWidth / 2;
                                this.y = BOTTOM_BOUND;

                                this.dropping = false;
                                this.shooting = false;
                                this.bounces = 0;
                        }
                }
        }

        initSpeed() {
                let angle = Math.atan2(this.touchY - this.y, this.touchX - this.x);
                this.speedX = shooterSpeed * Math.cos(angle);
                this.speedY = shooterSpeed * Math.sin(angle);
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