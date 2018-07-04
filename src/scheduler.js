const ENOUGH_TIME = 1;

let workQueue = [];
let nextUnitOfWork = null;

function schedule(task) {
    workQueu.push(task);
    requestIdleCallback(performWork);
}

function performWork(deadline) {
    if (!nextUnitOfWork) {
        nextUnitOfWork = workQueue.shift();
    }

    while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
        // Real work happens inside the performUnitOfWork, where the 
        // reconciliation code is in. The nextUnitOfWork will be a reference
        // to the next fiber we want to work on.
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    if (nextUnitOfWork || workQueue.length > 0) {
        requestIdleCallback(performWork);
    }
}