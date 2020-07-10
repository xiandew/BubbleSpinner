import ShooterController from "./utils/ShooterController.js";
import TouchHandler from "../../utils/TouchHandler.js";
import DataStore from "../../data/DataStore.js";
import UUID from "../../base/UUID.js";
import Bubble from "./Bubble.js";
import RendererManager from "../../renderer/RendererManager.js";


export default class Shooter {
    constructor() {
        this.id = UUID.getUUID();
        this.controller = new ShooterController(this);
        this.currShot = this.controller.createCurrShot();
        this.nextShot = this.controller.createNextShot();

        this.maxBounces = 8;
        this.curbounces = 0;

        this.touchHandler = new TouchHandler();
        wx.onTouchStart((e) => {
            if (this.readyToShoot) {
                this.renderTrace = true;
                this.touchX = e.touches[0].clientX;
                this.touchY = e.touches[0].clientY;
            }
        });
        this.touchHandler.onTouchMove((e) => {
            if (this.readyToShoot) {
                this.touchX = e.touches[0].clientX;
                this.touchY = e.touches[0].clientY;
            }
        });
        this.touchHandler.onTouchEnd((e) => {
            if (this.readyToShoot) {
                this.readyToShoot = false;
                this.renderTrace = false;
                this.shooting = true;

                let angle = Math.atan2(
                    this.touchY - this.currShot.getY(),
                    this.touchX - this.currShot.getX());
                this.currShot.speedX = this.currShot.speed * Math.cos(angle);
                this.currShot.speedY = this.currShot.speed * Math.sin(angle);
            }
        });

        this.rendererManager = new RendererManager();
        this.rendererManager.setRenderer(this, "Trace");
        this.rendererManager.setRenderer(this.nextShot, "ZoomIn");
        this.rendererManager.setRenderer(this.currShot, "ZoomInUp");
    }

    update() {
        if (this.currShot.zoomedInUp && this.nextShot.zoomedIn && !this.readyToShoot) {
            this.readyToShoot = true;
        }

        if (!this.shooting) {
            return;
        }

        // Collision detection with the spinner
        if (this.controller.spinner.collides(this.currShot)) {
            this.rendererManager.remove(this.currShot);
            this.rendererManager.remove(this.nextShot);
            this.currShot = this.controller.createCurrShot();
            this.nextShot = this.controller.createNextShot();
            this.rendererManager.setRenderer(this.nextShot, "ZoomIn");
            this.rendererManager.setRenderer(this.currShot, "ZoomInUp");
            // Reset current bounces
            this.curbounces = 0;
            return this.shooting = false;
        }

        if ((this.currShot.collideXBounds() ? (this.currShot.speedX *= (-1), true) : false) ||
            (this.currShot.collideYBounds() ? (this.currShot.speedY *= (-1), true) : false)) {
            this.curbounces++;
        }

        if (this.curbounces >= this.maxBounces && this.currShot.speedY < 0) {
            DataStore.MainScene.rendererManager.setRenderer(this.currShot, "Gravity");
            // Reset current bounces
            this.curbounces = 0;
            return this.shooting = false;
        }

        this.currShot.update();
    }

    render(ctx) {
        this.rendererManager.render(ctx);
    }

    static getInstance() {
        if (!Shooter.instance) {
            Shooter.instance = new Shooter();
        }
        return Shooter.instance;
    }
}