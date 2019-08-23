let events = {
    click: [],
    mouseMove: [],
    mouseDown: [],
    mouseUp: [],
    keyDown: []
};

let clearEvents = () => {
    events = {
        click: [],
        mouseMove: [],
        mouseDown: [],
        mouseUp: [],
        keyDown: []
    };
};

let getTargetCoords = (target, x, y) => {
    let rect = target.getBoundingClientRect();
    return {
        x: x - rect.left,
        y: y - rect.top
    };
};

let addClick = event => events.click.push(event);
let addClickEventListener = target => {
    target.addEventListener("click", event => {
        let coords = getTargetCoords(target, event.clientX, event.clientY);
        events.click.forEach(e => e(event, coords.x, coords.y));
    });
};

let addMouseMove = event => events.mouseMove.push(event);
let addMouseMoveEventListener = target => {
    target.addEventListener("mousemove", event => {
        let coords = getTargetCoords(target, event.clientX, event.clientY);
        events.mouseMove.forEach(e => e(event, coords.x, coords.y));
    });
};

let addMouseDown = event => events.mouseDown.push(event);
let addMouseDownEventListener = target => {
    target.addEventListener("mousedown", event => events.mouseDown.forEach(e => e(event)));
};

let addMouseUp = event => events.mouseUp.push(event);
let addMouseUpEventListener = target => {
    target.addEventListener("mouseup", event => events.mouseUp.forEach(e => e(event)));
};

let addTouchMoveEventListener = target => {
    target.addEventListener("touchmove", event => {
        event.preventDefault();
        let touch = event.touches[0];
        target.dispatchEvent(new MouseEvent("mousemove", {clientX: touch.clientX, clientY: touch.clientY}));
    });
};

let addTouchStartEventListener = target => {
    target.addEventListener("touchstart", event => {
        event.preventDefault();
        let touch = event.touches[0];
        let coords = getTargetCoords(target, touch.clientX, touch.clientY);
        target.dispatchEvent(new MouseEvent("mousedown", {clientX: coords.x, clientY: coords.y}));
    });
};

let addTouchEndEventListener = target => {
    target.addEventListener("touchend", event => {
        event.preventDefault();
    
        let touch = event.changedTouches[0];
        let coords = getTargetCoords(target, touch.clientX, touch.clientY);
    
        target.dispatchEvent(new MouseEvent("mouseup", {clientX: coords.x, clientY: coords.y}));
        target.dispatchEvent(new MouseEvent("click", {clientX: coords.x, clientY: coords.y}));    
    });
};

let addKeyDown = event => events.keyDown.push(event);
let addKeyDownEventListener = target => {
    target.addEventListener("keydown", event => {
        events.keyDown.forEach(e => e(event));
    });
};

let addContextMenuEventListener = target => target.addEventListener("contextmenu", event => event.preventDefault());

export default {
    clearEvents,
    addClick,
    addClickEventListener,
    addMouseMove,
    addMouseMoveEventListener,
    addMouseDown,
    addMouseDownEventListener,
    addMouseUp,
    addMouseUpEventListener,
    addTouchMoveEventListener,
    addTouchStartEventListener,
    addTouchEndEventListener,
    addKeyDown,
    addKeyDownEventListener,
    addContextMenuEventListener
};