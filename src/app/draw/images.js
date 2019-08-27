/** Chess Pieces */
export const drawChess = (draw, piece, x, y, fs, notFs, size = 100) => {
    switch(piece){
        case "PA":
            let bodyHighWidth = 80 * size / 100;
            let bodyLowWidth = 30 * size / 100;
            let bodyHeight = 25 * size / 100;
            let bodyUpperCircleRadius = 28 * size / 100;
            let bodyLateralWidth = 82 * size / 100;

            //Body
            draw.fm([
                [x - bodyHighWidth / 2, y + bodyHeight * 2],
                [x - bodyLowWidth / 2, y - bodyHeight],
                [x + bodyLowWidth / 2, y - bodyHeight],
                [x + bodyHighWidth / 2, y + bodyHeight * 2]
            ], {fs});
            draw.fc(x, y - bodyHeight * 2, bodyUpperCircleRadius, undefined, undefined, {fs: notFs});
            draw.fc(x - bodyLateralWidth, y - bodyHeight / 5, bodyLowWidth / 3 * 7, Math.PI * 1.9, Math.PI * 0.3, {fs: notFs});
            draw.fc(x + bodyLateralWidth, y - bodyHeight / 5, bodyLowWidth / 3 * 7, Math.PI * 0.6, Math.PI * 1.3, {fs: notFs});

            //Head
            draw.fc(x, y - bodyLowWidth * 2, bodyLowWidth, undefined, undefined, {fs});

            //Bottom
            draw.fr(x - bodyLowWidth * 1.5, y + bodyLowWidth * 2, bodyLowWidth * 3, bodyLowWidth / 1.25, {fs});
            draw.fc(x - bodyLowWidth * 1.5, y + bodyLowWidth * 2.4, bodyLowWidth * 0.4, undefined, undefined, {fs});
            draw.fc(x + bodyLowWidth * 1.5, y + bodyLowWidth * 2.4, bodyLowWidth * 0.4, undefined, undefined, {fs});
        break;
    }
};