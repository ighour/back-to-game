/** Life Circle */
let rad = deg => Math.PI / 180 * deg;
let percentToRad = percent => rad(270) + rad(360 * percent / 100);

export const drawLifeCircle = (draw, x, y, radius, life, lw = 5) => {
    draw.sc(x, y, radius, rad(270), percentToRad(100), {ss: "#EEEEEE", lw});
    draw.sc(x, y, radius, rad(270), percentToRad(life), {ss: "rgba(255,0,0,0.8)", lw});
    draw.fc(x, y, radius - lw + 3, 0, 2*Math.PI, {fs: "#15AAAA", lw});
};