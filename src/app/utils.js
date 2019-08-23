export let getMagVector = (x, y) => {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

export let getNormalizedVector = (x, y, mag) => {
    if(!mag)
        mag = getMagVector(x, y);

    if(mag === 0)
        return {x: 0, y: 0};

    return {
        x: x / mag,
        y: y / mag
    };
};