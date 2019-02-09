// util: ../ball.js
import {
        SHOOTER_SPEED
} from '../runtime/gameInfo';

module.exports = function(ball, shooter) {
        ball.hole.filled = false;
        let hole = ball.hole;
        ball.hole = null;
        ball.setX(hole.x);
        ball.setY(hole.y);

        ball.dropping = true;

        // angle between the horizontal and velocity
        let va = Math.atan2(shooter.speedY, shooter.speedX);
        // angle between the horizontal and the joint line from the ball to shooter
        let ha = Math.atan2(ball.getY() - shooter.y, ball.getX() - shooter.x);
        // difference between two angles
        let da = va - ha;

        let theSpeed = SHOOTER_SPEED * Math.cos(da) / 2;

        ball.speedX = theSpeed * Math.cos(ha);
        ball.speedY = theSpeed * Math.sin(ha);
}