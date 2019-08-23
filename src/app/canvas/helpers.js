let tempStyleAction = (callback, newStyles, ctx) => {
    let oldStyles;

    if(newStyles){
        oldStyles = {
            fillStyle: ctx.fillStyle,
            strokeStyle: ctx.strokeStyle,
            font: ctx.font,
            textAlign: ctx.textAlign,
            textBaseline: ctx.textBaseline,
        };
        styles(ctx, newStyles);
    }

    callback();

    if(newStyles)
        styles(ctx, oldStyles);
};

let styles = (ctx, {fillStyle, strokeStyle, font, textAlign, textBaseline}) => {
    if(fillStyle) ctx.fillStyle = fillStyle;
    if(strokeStyle) ctx.strokeStyle = strokeStyle;
    if(font) ctx.font = font;
    if(textAlign) ctx.textAlign = textAlign;
    if(textBaseline) ctx.textBaseline = textBaseline;
};

let clearCanvas = (ctx, x, y, width, height) => ctx.clearRect(x, y, width, height);

let line = (ctx, x1, y1, x2, y2, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }, styles, ctx);
};

let splitLine = (ctx, x1, y1, x2, y2, spacing, styles) => {
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
    }, styles, ctx);
};

let drawText = (ctx, type, text, x, y, styles) => {
    tempStyleAction(() => ctx[type](text, x, y), styles, ctx);
};
let fillText = (ctx, text, x, y, styles) => drawText(ctx, "fillText", text, x, y, styles);
let strokeText = (ctx, text, x, y, styles) => drawText(ctx, "strokeText", text, x, y, styles);

let fillTextBlock = (ctx, texts, x, y, spacing, styles) => {
    tempStyleAction(() => {
        for(let i = 0; i < texts.length; i++)
            ctx.fillText(texts[i], x, y + spacing*i);
    }, styles, ctx);
};

let drawRect = (ctx, type, x, y, width, height, styles) => {
    tempStyleAction(() => ctx[type](x, y, width, height), styles, ctx);
};
let fillRect = (ctx, x, y, width, height, styles) => drawRect(ctx, "fillRect", x, y, width, height, styles);
let strokeRect = (ctx, x, y, width, height, styles) => drawRect(ctx, "strokeRect", x, y, width, height, styles);

let drawCircle = (ctx, type, x, y, radius, startAngle = 0, endAngle = 2*Math.PI, styles) => {
    tempStyleAction(() => {
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx[type]();
    }, styles, ctx);
};
let fillCircle = (ctx, x, y, radius, startAngle, endAngle, styles) => drawCircle(ctx, "fill", x, y, radius, startAngle, endAngle, styles);
let strokeCircle = (ctx, x, y, radius, startAngle, endAngle, styles) => drawCircle(ctx, "stroke", x, y, radius, startAngle, endAngle, styles);

export default {
    clearCanvas,
    line,
    splitLine,
    fillText,
    strokeText,
    fillTextBlock,
    fillRect,
    strokeRect,
    fillCircle,
    strokeCircle
};