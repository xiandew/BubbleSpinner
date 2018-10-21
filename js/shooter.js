import Ball, {BALL_SIZE, BALLS} from './ball'

export const LINEAR_SPEED = 15
export default class Shooter extends Ball {
	constructor() {
		super(canvas.width / 2, canvas.height - BALL_SIZE, -1, true)
		this.initEvent()
		this.initShooter()
	}

	initShooter() {
		this.x = canvas.width / 2
		this.y = canvas.height - BALL_SIZE
		this.img.src = BALLS[Math.floor(Math.random() * BALLS.length)]
		this.touched = false
		this.shooting = false
	}

	initEvent() {
		canvas.addEventListener('touchstart', ((e) => {
			e.preventDefault()
			if (!this.shooting) {
				this.touched = true
				this.touchX = e.touches[0].clientX
				this.touchY = e.touches[0].clientY
			}

		}).bind(this))

		canvas.addEventListener('touchmove', ((e) => {
			e.preventDefault()
			if (!this.shooting && this.touched) {
				this.touchX = e.touches[0].clientX
				this.touchY = e.touches[0].clientY
			}

		}).bind(this))

		canvas.addEventListener('touchend', ((e) => {
			e.preventDefault()
			if (!this.shooting) {
				this.touched = false
				this.initSpeed();
				this.shooting = true
			}
		}).bind(this))
	}

	render(ctx) {
		super.render(ctx)

		if (this.touched) {
			this.renderArrow(ctx)
		}
	}

	renderArrow(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = 'green';

		// from start point
		ctx.moveTo(this.x, this.y);
		// to touch point 
		ctx.lineTo(this.touchX, this.touchY);

		let headLenth = 10
		let headAngle = Math.atan2(this.touchY - this.y, this.touchX - this.x)

		// form a little triangle for the arrow head
		// from touch point to right side of the head
		ctx.lineTo(this.touchX - headLenth * Math.cos(headAngle - Math.PI / 6),
			this.touchY - headLenth * Math.sin(headAngle - Math.PI / 6));
		// to bottom side of the head
		ctx.lineTo(this.touchX - headLenth * Math.cos(headAngle + Math.PI / 6),
			this.touchY - headLenth * Math.sin(headAngle + Math.PI / 6));
		// back to the touch point
		ctx.lineTo(this.touchX, this.touchY);

		ctx.stroke();
		ctx.closePath();
	}

	update(spiral) {
		if (!this.shooting) {
			return
		}

		if ((this.x + this.width / 2) >= canvas.width || (this.x - this.width / 2) <= 0) {
			this.speedX *= (-1);
		}
		if ((this.y + this.height / 2) >= canvas.height || (this.y - this.height / 2) <= 0) {
			this.speedY *= (-1);
		}

		this.x += this.speedX
		this.y += this.speedY

		for (let i = 0; i < spiral.balls.length; i++) {
			if (spiral.balls[i].isCollideWith(this)) {
				this.shooting = false
				spiral.onCollision(this)
				return
			}
		}
	}

	initSpeed() {
		let angle = Math.atan2(this.touchY - this.y, this.touchX - this.x)
		this.speedX = LINEAR_SPEED * Math.cos(angle)
		this.speedY = LINEAR_SPEED * Math.sin(angle)
	}

}