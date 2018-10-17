import Ball from './ball'
import { ballSize } from './spiral'

export default class Shooter extends Ball {
        constructor() {
		super(canvas.width / 2, canvas.height - ballSize, ballSize)
		this.touched = false
		this.initEvent()
		this.speed = 15
		this.shooting = false
        }

	render(ctx){
		super.render(ctx)

		if(this.touched){
			this.renderArrow(ctx)
		}

	}

	renderArrow(ctx){
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

	initEvent() {
		canvas.addEventListener('touchstart', ((e) => {
			e.preventDefault()
			this.touched = true
			this.touchX = e.touches[0].clientX
			this.touchY = e.touches[0].clientY
			
		}).bind(this))

		canvas.addEventListener('touchmove', ((e) => {
			e.preventDefault()
			if(this.touched){
				this.touchX = e.touches[0].clientX
				this.touchY = e.touches[0].clientY
			}

		}).bind(this))

		canvas.addEventListener('touchend', ((e) => {
			e.preventDefault()
			this.touched = false

			this.initSpeed();
			this.shooting = true
		}).bind(this))
	}

	update(spiral){
		if (!this.shooting) {
			return
		}

		let prevX = this.x
		let prevY = this.y

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
				//spiral.onCollision()
				this.shooting = false
				this.x = prevX
				this.y = prevY
				return
			}
		}
	}

	initSpeed(){
		let angle = Math.atan2(this.touchY - this.y, this.touchX - this.x)
		this.speedX = this.speed * Math.cos(angle)
		this.speedY = this.speed * Math.sin(angle)
	}

}