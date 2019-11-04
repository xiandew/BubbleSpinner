import Shared from "../shared";
let shared = new Shared();
let ctx = shared.ctx;

/*----------------------------------------------------------------------------*/

module.exports = function(btn) {
        drawRoundRect(btn.area, btn.bgColour);
        draw(btn);
}

function draw(obj) {
        ctx.beginPath();
        let img = wx.createImage();
        img.onload = function() {
                ctx.drawImage(
                        img,
                        obj.x - obj.w / 2,
                        obj.y - obj.h / 2,
                        obj.w,
                        obj.h
                );
        }
        img.src = obj.imgSrc;
        ctx.closePath();
}

function drawRoundRect(area, bgColour) {
        let x = area.startX;
        let y = area.startY;
        let w = area.w;
        let h = area.h;
        let r = area.h / 2;

        if (w < 2 * r) {
                r = w / 2;
        }
        if (h < 2 * r) {
                r = h / 2;
        }
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);

        ctx.fillStyle = bgColour;
        ctx.fill();
        ctx.closePath();
}