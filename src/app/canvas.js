/** Canvas Config */
let canvas = document.querySelector("#gc"), ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 768;

/** Panel */
let p = {
    x: 0,
    y: canvas.height - 150,
    w: canvas.width,
    h: 150
};

/** Context Config */
let defaultCtx = {
    lw: 2,
    fs: "#F0EAD6",
    ss: "#F0EAD6",
    f: 50,
    ta: "c",
    tb: "m",
};
let defaultCtxTA = {
    s: "start",
    e: "end",
    l: "left",
    c: "center",
    r: "right"
};
let defaultCtxTB = {
    t: "top",
    b: "bottom",
    m: "middle",
    a: "alphabetic",
    h: "hanging"
};
ctx.lineWidth = defaultCtx.lw;
ctx.fillStyle = defaultCtx.fs;
ctx.strokeStyle = defaultCtx.ss;
ctx.font = `${defaultCtx.f}px Arial`;
ctx.textAlign = defaultCtxTA[defaultCtx.ta];
ctx.textBaseline = defaultCtxTB[defaultCtx.tb];

/** Draw Functions */
let d = {};

let tempStyleAction = (callback, newStyles) => {
    if(newStyles) styles(newStyles);
    callback();
    if(newStyles) styles(defaultCtx);
};

let styles = ({fs, ss, f, ta, tb, lw}) => {
    if(lw) ctx.lineWidth = lw;
    if(fs) ctx.fillStyle = fs;
    if(ss) ctx.strokeStyle = ss;
    if(f) ctx.font = `${f}px Arial`;
    if(ta) ctx.textAlign = defaultCtxTA[ta];
    if(tb) ctx.textBaseline = defaultCtxTB[tb];
};

//Clear Canvas
d.cc = (x, y, w, h) => ctx.clearRect(x, y, w, h);

//Line
d.l = (x1, y1, x2, y2, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }, styles);
};

//Split Line
d.sl = (x1, y1, x2, y2, spacing, styles) => {
    tempStyleAction(() => {
        let x = x1;
        let y = y1;

        let spacingX = (x2 - x1) / spacing;
        let spacingY = (y2 - y1) / spacing;

        ctx.beginPath();

        while(x < x2 || y < y2){
            ctx.moveTo(x, y);
            x += spacingX;
            y += spacingY;
            ctx.lineTo(x, y);
            x += spacingX;
            y += spacingY;
        }

        ctx.stroke();
    }, styles);
};

//Fill Text
d.ft = (text, x, y, styles) => tempStyleAction(() => ctx.fillText(text, x, y), styles);

let drawRect = (type, x, y, width, height, styles) => tempStyleAction(() => ctx[type](x, y, width, height), styles);
//Fill Rect
d.fr = (x, y, width, height, styles) => drawRect("fillRect", x, y, width, height, styles);
//Stroke Rect
d.sr = (x, y, width, height, styles) => drawRect("strokeRect", x, y, width, height, styles);

let drawCircle = (type, x, y, radius, startAngle = 0, endAngle = 2*Math.PI, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx[type]();
    }, styles);
};
//Fill Circle
d.fc = (x, y, radius, startAngle, endAngle, styles) => drawCircle("fill", x, y, radius, startAngle, endAngle, styles);
//Stroke Circle
d.sc = (x, y, radius, startAngle, endAngle, styles) => drawCircle("stroke", x, y, radius, startAngle, endAngle, styles);


//Draw Mix
let drawMix = (type, coords, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        let first = coords.shift();
        ctx.moveTo(first[0], first[1]);
        coords.forEach(c => ctx.lineTo(c[0], c[1]));
        ctx.closePath();
        ctx[type]();
    }, styles);
};
//Fill Mix
d.fm = (coords, styles) => drawMix("fill", coords, styles);
//Stroke Mix
d.sm = (coords, styles) => drawMix("stroke", coords, styles);

/** Components */

//Draw Texts
let drawTexts = (texts, x, y, styles, currentTime) => {
    let spacing = 0, neededTime = 0;

    for(let i = 0; i < texts.length; i++){
        let text = texts[i];

        if(text.tm){
            neededTime += text.tm;
            if(currentTime < neededTime)
                break;
        }

        let currentStyles = Object.assign({}, styles, text.s);
        let y2 = text.y ? text.y : y;

        d.ft(text.c, text.x ? text.x : x, y2 + spacing, currentStyles);

        if(text.sp)
            spacing += text.sp;
    }
};

//Draw Button
let drawButton = (position, text, styles) => {
    d.ft(text, position.x + position.w / 2, position.y + position.h / 2, styles);
    d.sr(position.x, position.y, position.w, position.h, styles);
};

//draw Life Circle
let rad = deg => Math.PI / 180 * deg;
let percentToRad = percent => rad(270) + rad(360 * percent / 100);

let drawLifeCircle = (x, y, radius, life, lw = 5) => {
    if(life < 0) life = 0;
    d.sc(x, y, radius, rad(270), percentToRad(100), {ss: "#EEEEEE", lw});
    d.sc(x, y, radius, rad(270), percentToRad(life), {ss: "rgba(255,0,0,0.8)", lw});
    d.fc(x, y, radius - lw + 3, 0, 2*Math.PI, {fs: "#15AAAA", lw});
    d.ft(Math.ceil(life), x, y, {fs: "rgba(255,0,0,0.5)", f: 30});
};

/** UI */

//Tutorial
let drawTutorial = (tutorial, title, texts, timer, button, buttonTitle) => {
    tutorial--;

    d.ft(title[tutorial], canvas.width / 2, 70, {f: 70});

    drawTexts(texts[tutorial], 20, 160, {ta: "l", f: 30}, timer);

    if(timer >= 1000)
        drawButton(button[tutorial], buttonTitle[tutorial]);
};

//Panel
let drawPanel = (player, boss, text) => {
    //Divisor
    d.l(p.x, p.y + 5, p.x + p.w, p.y + 5, {ss: "#444444"});

    //Life
    let x = p.x + p.w / 12, y = p.y + p.h / 2, radius = 50;
    drawLifeCircle(x, y, radius, player.l);
    drawLifeCircle(x * 11, y, radius, boss.l);

    if(text)
        d.ft(text, p.x + p.w / 2, p.y + p.h / 2);
    else{
        // Names
        let tb = "b";
        y += p.h / 2;
        radius += 5;
        d.ft(player.n, x + radius, y, {tb, ta: "l"});
        d.ft(boss.n, x * 11 - radius, y, {tb, ta: "r"});
    }
};

/** Images */

//Chess Pieces
let drawChess = (piece, x, y, fs, notFs, size = 100) => {
    let baseUnit = size / 100;

    if(piece == "PA")
        baseUnit *= 0.8;

    //Body
    if(piece != "KN"){
        d.fm([
            [x - baseUnit * 40, y + baseUnit * 50],
            [x - baseUnit * 15, y - baseUnit * 25],
            [x + baseUnit * 15, y - baseUnit * 25],
            [x + baseUnit * 40, y + baseUnit * 50]
        ], {fs});
        d.fc(x, y - baseUnit * 50, baseUnit * 28, undefined, undefined, {fs: notFs});
        d.fc(x - baseUnit * 82, y - baseUnit * 5, baseUnit * 70, Math.PI * 1.9, Math.PI * 0.3, {fs: notFs});
        d.fc(x + baseUnit * 82, y - baseUnit * 5, baseUnit * 70, Math.PI * 0.6, Math.PI * 1.3, {fs: notFs});
    }

    switch(piece){
        case "PA": d.fc(x, y - baseUnit * 55, baseUnit * 25, undefined, undefined, {fs}); break;
        case "RO":
            d.fm([
                [x - baseUnit * 30, y - baseUnit * 30],
                [x - baseUnit * 36, y - baseUnit * 66],
                [x + baseUnit * 36, y - baseUnit * 66],
                [x + baseUnit * 30, y - baseUnit * 30],
            ], {fs});
            d.fr(x - baseUnit * 15, y - baseUnit * 66, baseUnit * 10, baseUnit * 15, {fs: notFs});
            d.fr(x + baseUnit * 15, y - baseUnit * 66, - baseUnit * 10, baseUnit * 15, {fs: notFs});
        break;
        case "KN": 
            d.fm([
                [x - baseUnit * 45, y + baseUnit * 50],
                [x - baseUnit * 54, y - baseUnit * 75],
                [x + baseUnit * 54, y - baseUnit * 75],
                [x + baseUnit * 45, y + baseUnit * 50],
            ], {fs});
            d.fm([
                [x - baseUnit * 54, y - baseUnit * 25],
                [x - baseUnit * 30, y - baseUnit * 60],
                [x - baseUnit * 36, y - baseUnit * 75],
                [x - baseUnit * 57, y - baseUnit * 75],
            ], {fs: notFs});
            d.fm([
                [x - baseUnit * 45, y + baseUnit * 50],
                [x - baseUnit * 54, y - baseUnit * 2.5],
                [x - baseUnit * 6, y - baseUnit * 25],
                [x - baseUnit * 10, y],
                [x - baseUnit * 12, y + baseUnit * 10],
            ], {fs: notFs});
            d.fm([
                [x + baseUnit * 45, y + baseUnit * 50],
                [x + baseUnit * 60, y - baseUnit * 87.5],
                [x, y - baseUnit * 87.5],
                [x + baseUnit * 3.75, y - baseUnit * 80],
                [x + baseUnit * 20, y - baseUnit * 62.5],
                [x + baseUnit * 25, y - baseUnit * 50],
            ], {fs: notFs});
        break;
        case "BI": 
            d.fr(x - baseUnit * 30 / 1.3, y - baseUnit * 90, baseUnit * 45, baseUnit * 45, {fs});
            d.fc(x, y - baseUnit * 51, baseUnit * 30 / 1.28, undefined, undefined, {fs});
            d.fm([
                [x - baseUnit * 30 / 1.24, y - baseUnit * 51],
                [x - baseUnit * 30 / 1.24, y - baseUnit * 90],
                [x + baseUnit * 30 / 1.24, y - baseUnit * 90],
                [x + baseUnit * 30 / 1.24, y - baseUnit * 51],
                [x, y - baseUnit * 90],
            ], {fs: notFs});
            d.fc(x, y - baseUnit * 88.5, baseUnit * 10, undefined, undefined, {fs});
            d.l(x, y - baseUnit * 51, x + baseUnit * 16.5, y - baseUnit * 69, {ss: notFs, lw: baseUnit * 2});
        break;
        case "QU": 
            d.fm([
                [x - baseUnit * 24, y - baseUnit * 30],
                [x - baseUnit * 30, y - baseUnit * 48],
                [x - baseUnit * 42, y - baseUnit * 66],
                [x - baseUnit * 18, y - baseUnit * 54],
                [x, y - baseUnit * 66],
                [x + baseUnit * 18, y - baseUnit * 54],
                [x + baseUnit * 42, y - baseUnit * 66],
                [x + baseUnit * 30, y - baseUnit * 48],
                [x + baseUnit * 24, y - baseUnit * 30],
            ], {fs});
            d.fc(x, y - baseUnit * 78, baseUnit * 10, undefined, undefined, {fs});
            d.l(x - baseUnit * 30, y - baseUnit * 36, x + baseUnit * 30, y - baseUnit * 36, {ss: notFs, lw: baseUnit * 3});
        break;
        case "KI": 
            d.fm([
                [x - baseUnit * 24, y - baseUnit * 30],
                [x - baseUnit * 33, y - baseUnit * 66],
                [x + baseUnit * 33, y - baseUnit * 66],
                [x + baseUnit * 24, y - baseUnit * 30],
            ], {fs});
            d.fc(x, y - baseUnit * 60, baseUnit * 20, undefined, undefined, {fs});
            d.l(x, y - baseUnit * 60, x, y - baseUnit * 99, {ss: fs, lw: baseUnit * 30 / 5.5});
            d.l(x - baseUnit * 10, y - baseUnit * 90, x + baseUnit * 10, y - baseUnit * 90, {ss: fs, lw: baseUnit * 30 / 5.5});
            d.l(x - baseUnit * 20, y - baseUnit * 68.4, x + baseUnit * 20, y - baseUnit * 68.4, {ss: notFs, lw: baseUnit * 30 / 5.5});
            d.l(x - baseUnit * 30, y - baseUnit * 36, x + baseUnit * 30, y - baseUnit * 36, {ss: notFs, lw: baseUnit * 3});
        break;
    }

    //Bottom
    d.fr(x - baseUnit * 45, y + baseUnit * 60, baseUnit * 90, baseUnit * 24, {fs});
    d.fc(x - baseUnit * 45, y + baseUnit * 72, baseUnit * 12, undefined, undefined, {fs});
    d.fc(x + baseUnit * 45, y + baseUnit * 72, baseUnit * 12, undefined, undefined, {fs});
};

export const cp = {
    i: canvas,  //instance
    p,  //panel 
    d,  //draw
    UI: {
        tx: drawTexts,
        b: drawButton,
        t: drawTutorial,
        p: drawPanel,
    },
    im: {
        c: drawChess
    }
};











/** Variables */
let auxCanvas = document.querySelector("#ga"), auxCtx = auxCanvas.getContext("2d");

/** Canvas Config */
let w = canvas.width, h = 50;
auxCanvas.width = w;
auxCanvas.height = h;

/** Context Config */
auxCtx.font = "20px Arial";
auxCtx.textBaseline = "center";

/** Fixed Draw */
let auxDefText = "";

/** Update */
let update = (FPS, maxFPS) => {
    auxCtx.clearRect(0, 0, w, h);
    auxCtx.textAlign = "left";
    auxCtx.fillStyle = "#777777";
    auxCtx.fillText(auxDefText, 0, h / 2);
    auxCtx.textAlign = "right";
    auxCtx.fillStyle = FPS < maxFPS / 2 ? "red" : "#777777";
    auxCtx.fillText(`${FPS} FPS`, w, h / 2);
};

export const ca = {
    i: auxCanvas,   //instance
    u: update,   //update canvas
    t: text => auxDefText = text    //set left canvas text
};