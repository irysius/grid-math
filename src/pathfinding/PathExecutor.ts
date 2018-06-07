import { IVector2, subtract, multiply, add, zero } from "../Vector2";
import { SlidingWindow, ISlidingWindow, map } from "../helpers/Iterable";
import { IWorldPosition, create } from "../WorldPosition";

export interface IPathExecutor {
    update(msElapsed: number): void;
    readonly value: IWorldPosition;
    readonly done: boolean;
}

interface IStep {
    curr: IWorldPosition;
    next: IWorldPosition;
}
function asStep(curr: IWorldPosition, sw: ISlidingWindow<IWorldPosition>): IStep {
    return {
        curr,
        next: sw.nextValues[0]
    };
}

export function PathExecutor(path: IterableIterator<IWorldPosition>, msPerStep: number): IPathExecutor {
    let _sw = SlidingWindow(path, { prevCapacity: 0, nextCapacity: 1 });
    let sw = map(asStep)(_sw);
    // the first step should really be where you're at.
    let { value: step, done } = sw.next();
    let value = step.curr;

    let msStep = 0;
    let delta = createDelta(step);
    
    function createDelta(step: IStep) {
        // (next - curr) / msPerStep
        if (!step.next) { 
            return create(0, 0); 
        } else {
            return multiply(subtract(step.next, step.curr), 1 / msPerStep);
        }
    }

    function update(msElapsed: number): void {
        if (done) { return; }
        msStep += msElapsed;

        // In the event msElapsed is way bigger than msPerStep, we need to ff to the correct step.
        let overflowTicks = 0;
        while (msStep > msPerStep) {
            msStep -= msPerStep;
            overflowTicks++;
        }

        if (overflowTicks) {
            let i: number, next: IteratorResult<IStep>, _step: IStep;
            for (i = 0; i < overflowTicks; ++i) {
                next = sw.next();
                // break early if there's no more steps
                if (next.done) { break; }
                _step = next.value || step;
            }
            delta = createDelta(_step);
            // need to adjust with the remainder ms
            value = add(_step.curr, multiply(delta, msStep)); 
            done = next.done;
        } else {
            // need to just add the delta to the current value
            value = add(value, multiply(delta, msElapsed));
        }
    }

    let proxy = { update };
    Object.defineProperty(proxy, 'value', {
        get: () => value, enumerable: true
    });
    Object.defineProperty(proxy, 'done', {
        get: () => done, enumerable: true
    });
    return proxy as any;
}
