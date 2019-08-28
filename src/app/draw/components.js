/** Draw Texts */
export const drawTexts = (draw, texts, x, y, styles, currentTime) => {
    let spacing = 0, neededTime = 0;

    for(let i = 0; i < texts.length; i++){
        let text = texts[i];

        if(text.tm){
            neededTime += text.tm;
            if(currentTime < neededTime)
                break;
        }

        if(text.co && !text.co())
            return;

        let currentStyles = Object.assign({}, styles, text.s);
        let y2 = text.y ? text.y : y;

        draw.ft(text.c, text.x ? text.x : x, y2 + spacing, currentStyles);

        spacing += text.sp;
    }
};

/** Button */
export const drawButton = (draw, position, text, styles) => {
    draw.ft(text, position.x + position.w / 2, position.y + position.h / 2, styles);
    draw.sr(position.x, position.y, position.w, position.h, styles);
};

/** Life Circle */
let rad = deg => Math.PI / 180 * deg;
let percentToRad = percent => rad(270) + rad(360 * percent / 100);

export const drawLifeCircle = (draw, x, y, radius, life, lw = 5) => {
    if(life < 0) life = 0;
    draw.sc(x, y, radius, rad(270), percentToRad(100), {ss: "#EEEEEE", lw});
    draw.sc(x, y, radius, rad(270), percentToRad(life), {ss: "rgba(255,0,0,0.8)", lw});
    draw.fc(x, y, radius - lw + 3, 0, 2*Math.PI, {fs: "#15AAAA", lw});
    draw.ft(Math.ceil(life), x, y, {fs: "rgba(255,0,0,0.5)", f: 30});
};

/** Arrow Pointer */
export const drawArrowPointer = (draw, dirX, dirY, position, active = true) => {
    draw.fc(position.x, position.y, 5);

    if(active){
        let L1 = 40, L2 = 15, angle = 0.7;
        let x1 = position.x, y1 = position.y;
        let x2 = x1 + L1 * dirX, y2 = y1 + L1 * dirY;
    
        draw.l(x2, y2, x2 + L2 / L1 * ((x1 - x2) * Math.cos(angle) + (y1 - y2) * Math.sin(angle)), 
            y2 + L2 / L1 * ((y1 - y2) * Math.cos(angle) - (x1 - x2) * Math.sin(angle)));

        draw.l(x2, y2, x2 + L2 / L1 * ((x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle)), 
            y2 + L2 / L1 * ((y1 - y2) * Math.cos(angle) + (x1 - x2) * Math.sin(angle)));
    }
};