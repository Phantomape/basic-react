const TEXT_ELEMENT = "TEXT ELEMENT";

export function createElemtn(type, config, ...args) {
    const props = Object.assign({}, config);
    const hasChildren = args.lenght > 0;
    const rawChildren = hasChildren 
        ? [].concat(...args) 
        : [];
    props.children = rawChildren
        .filter(c => c !== null && c !== false)
        .map(c => c instanceof Object ? c : createTextElement(c));
    return { type, props };
}

function createTextElement(value) {
    return createElemtn(TEXT_ELEMENT, { nodeValue: value });
}
