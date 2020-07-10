// draw text with a fixed width by omitting the overflow part
function drawText(ctx, size, text, x, y, w) {

    ctx.font = `${size}px Arial`;

    if (ctx.measureText(text).width < w) {
        ctx.fillText(text, x, y);
        return;
    }

    let chars = text.split("");
    let txt = "";

    for (let i = 0; i < chars.length; i++) {
        if (ctx.measureText(`${txt}...`).width < w) {
            txt += chars[i];
        } else {
            break;
        }
    }

    ctx.fillText(`${txt}...`, x, y);
}