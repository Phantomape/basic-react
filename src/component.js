import { reconcile } from "./reconciler";

export class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
    }

    setState(partialState) {
        this.state = Object.assign({}, this.state, partialState);
    }
}

export function createPublicInstance(element, internalInstance) {
    const { type, props } = element;
    const publicInstance = new type(props);
    publicInstance.__internalInstance = internalInstance;
    return publicInstance;
}

function updateInstance(internalInstance) {
    const parentDom = internalInstance.dom.parentDom;
    const element = internalInstance.element;
    reconcile(parentDom, internalInstance, element);
}
