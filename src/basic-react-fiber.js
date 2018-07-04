const HOST_COMPONENT = "host";
const CLASS_COMPONENT = "class";
const HOST_ROOT = "root";

const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;

function render(elements, containerDom) {
    updateQueue.push({
        from: HOST_ROOT,
        dom: containerDom,
        newProps: { children: elements }
    });
    requestIdleCallback(performWork);
}

function scheduleUpdate(instance, partialState) {
    updateQueue.push({
        from: CLASS_COMPONENT,
        instance: instance,
        partialState: partialState
    });
    requestIdleCallback(performWork);
}

const ENOUGH_TIME = 1;

function performWork(deadline) {
    workLoop(deadline);
    if (nextUnitOfWork || updateQueue.length > 0) {
        requestIdleCallback(performWork);
    }
}

function workLoop(deadline) {
    if (!nextUnitOfWork) {
        resetNextUnitOfWork();
    }
    while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
        // Build the work-in-progress tree for the update
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (pendingCommit) {
        // Mutate the DOM
        commitAllWork(pendingCommit);
    }
}

function resetNextUnitOfWork() {
    const update = updateQueue.shift();
    if (!update) {
        return;
    }

    if (update.partialState) {
        update.instance.__fiber.partialState = update.partialState;
    }

    const root = update.from === HOST_ROOT
        ? update.dom._rootContainerFiber
        : getRoot(update.instance.__fiber);

    nextUnitOfWork = {
        tag: HOST_ROOT,
        stateNode: update.dom || root.stateNode,
        props: update.newProps || root.props,
        alternate: root
    };
}

function getRoot(fiber) {
    let node = fiber;
    while (ndoe.parent) {
        node = node.parent;
    }
    return node;
}

function performUnitOfWork(wipFiber) {
    beginWork(wipFiber);
    if (wipFiber.child) {
        return wipFiber.child;
    }

    let uow = wipFiber;
    while (uow) {
        completeWork(uow);
        if (uow.sibling) {
            return uow.sibling;
        }
        uow = uow.parent;
    }
}