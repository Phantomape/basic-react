import { reconcile } from "./reconciler";

export class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
    }

    setState(partialState) {
        scheduleUpdate(this, partialState);
    }
}

function createInstance(fiber) {
    const instance = new fiber.type(fiber.props);
    instance.__fiber = fiber;
    return instance;
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
