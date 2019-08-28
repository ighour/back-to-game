/** Chess Pieces */
export const drawChess = (draw, piece, x, y, fs, notFs, size = 100) => {
    let baseUnit = size / 100;

    if(piece == "PA")
        baseUnit *= 0.8;

    //Body
    if(piece != "KN"){
        draw.fm([
            [x - baseUnit * 40, y + baseUnit * 50],
            [x - baseUnit * 15, y - baseUnit * 25],
            [x + baseUnit * 15, y - baseUnit * 25],
            [x + baseUnit * 40, y + baseUnit * 50]
        ], {fs});
        draw.fc(x, y - baseUnit * 50, baseUnit * 28, undefined, undefined, {fs: notFs});
        draw.fc(x - baseUnit * 82, y - baseUnit * 5, baseUnit * 70, Math.PI * 1.9, Math.PI * 0.3, {fs: notFs});
        draw.fc(x + baseUnit * 82, y - baseUnit * 5, baseUnit * 70, Math.PI * 0.6, Math.PI * 1.3, {fs: notFs});
    }

    switch(piece){
        case "PA": draw.fc(x, y - baseUnit * 55, baseUnit * 25, undefined, undefined, {fs}); break;
        case "RO":
            draw.fm([
                [x - baseUnit * 30, y - baseUnit * 30],
                [x - baseUnit * 36, y - baseUnit * 66],
                [x + baseUnit * 36, y - baseUnit * 66],
                [x + baseUnit * 30, y - baseUnit * 30],
            ], {fs});
            draw.fr(x - baseUnit * 15, y - baseUnit * 66, baseUnit * 10, baseUnit * 15, {fs: notFs});
            draw.fr(x + baseUnit * 15, y - baseUnit * 66, - baseUnit * 10, baseUnit * 15, {fs: notFs});
        break;
        case "KN": 
            draw.fm([
                [x - baseUnit * 45, y + baseUnit * 50],
                [x - baseUnit * 54, y - baseUnit * 75],
                [x + baseUnit * 54, y - baseUnit * 75],
                [x + baseUnit * 45, y + baseUnit * 50],
            ], {fs});
            draw.fm([
                [x - baseUnit * 54, y - baseUnit * 25],
                [x - baseUnit * 30, y - baseUnit * 60],
                [x - baseUnit * 36, y - baseUnit * 75],
                [x - baseUnit * 57, y - baseUnit * 75],
            ], {fs: notFs});
            draw.fm([
                [x - baseUnit * 45, y + baseUnit * 50],
                [x - baseUnit * 54, y - baseUnit * 2.5],
                [x - baseUnit * 6, y - baseUnit * 25],
                [x - baseUnit * 10, y],
                [x - baseUnit * 12, y + baseUnit * 10],
            ], {fs: notFs});
            draw.fm([
                [x + baseUnit * 45, y + baseUnit * 50],
                [x + baseUnit * 60, y - baseUnit * 87.5],
                [x, y - baseUnit * 87.5],
                [x + baseUnit * 3.75, y - baseUnit * 80],
                [x + baseUnit * 20, y - baseUnit * 62.5],
                [x + baseUnit * 25, y - baseUnit * 50],
            ], {fs: notFs});
        break;
        case "BI": 
            draw.fr(x - baseUnit * 30 / 1.3, y - baseUnit * 90, baseUnit * 45, baseUnit * 45, {fs});
            draw.fc(x, y - baseUnit * 51, baseUnit * 30 / 1.28, undefined, undefined, {fs});
            draw.fm([
                [x - baseUnit * 30 / 1.24, y - baseUnit * 51],
                [x - baseUnit * 30 / 1.24, y - baseUnit * 90],
                [x + baseUnit * 30 / 1.24, y - baseUnit * 90],
                [x + baseUnit * 30 / 1.24, y - baseUnit * 51],
                [x, y - baseUnit * 90],
            ], {fs: notFs});
            draw.fc(x, y - baseUnit * 88.5, baseUnit * 10, undefined, undefined, {fs});
            draw.l(x, y - baseUnit * 51, x + baseUnit * 16.5, y - baseUnit * 69, {ss: notFs, lw: baseUnit * 2});
        break;
        case "QU": 
            draw.fm([
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
            draw.fc(x, y - baseUnit * 78, baseUnit * 10, undefined, undefined, {fs});
            draw.l(x - baseUnit * 30, y - baseUnit * 36, x + baseUnit * 30, y - baseUnit * 36, {ss: notFs, lw: baseUnit * 3});
        break;
        case "KI": 
            draw.fm([
                [x - baseUnit * 24, y - baseUnit * 30],
                [x - baseUnit * 33, y - baseUnit * 66],
                [x + baseUnit * 33, y - baseUnit * 66],
                [x + baseUnit * 24, y - baseUnit * 30],
            ], {fs});
            draw.fc(x, y - baseUnit * 60, baseUnit * 20, undefined, undefined, {fs});
            draw.l(x, y - baseUnit * 60, x, y - baseUnit * 99, {ss: fs, lw: baseUnit * 30 / 5.5});
            draw.l(x - baseUnit * 10, y - baseUnit * 90, x + baseUnit * 10, y - baseUnit * 90, {ss: fs, lw: baseUnit * 30 / 5.5});
            draw.l(x - baseUnit * 20, y - baseUnit * 68.4, x + baseUnit * 20, y - baseUnit * 68.4, {ss: notFs, lw: baseUnit * 30 / 5.5});
            draw.l(x - baseUnit * 30, y - baseUnit * 36, x + baseUnit * 30, y - baseUnit * 36, {ss: notFs, lw: baseUnit * 3});
        break;
    }

    //Bottom
    draw.fr(x - baseUnit * 45, y + baseUnit * 60, baseUnit * 90, baseUnit * 24, {fs});
    draw.fc(x - baseUnit * 45, y + baseUnit * 72, baseUnit * 12, undefined, undefined, {fs});
    draw.fc(x + baseUnit * 45, y + baseUnit * 72, baseUnit * 12, undefined, undefined, {fs});
};

/** Other */
export const drawOther = (draw, name, x, y, fs, notFs, size = 100) => {
    let baseUnit = size / 100;

    switch(name){
        case "LO":  //Lock
            draw.fc(x, y - baseUnit * 5, baseUnit * 10, undefined, undefined, {fs});
            draw.fr(x - baseUnit * 10, y + baseUnit * 10, baseUnit * 20, -baseUnit * 13, {fs});
            draw.fc(x, y - baseUnit * 5, baseUnit * 6.5, Math.PI, Math.PI * 2, {fs: notFs});
            draw.fc(x, y + baseUnit, baseUnit * 3.5, undefined, undefined, {fs: notFs});
            draw.l(x, y, x, y + baseUnit * 7, {ss: notFs, lw: 4});
        break;
    }
};