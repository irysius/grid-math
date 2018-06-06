import { IVector2, subtract, multiply, add } from "../Vector2";
import { SlidingWindow } from "../helpers/Iterable";
import { IWorldPosition } from "../WorldPosition";

export interface IPathExecutor {
    update(msElapsed: number): void;
    readonly value: IWorldPosition;
    readonly done: boolean;
}

export function PathExecutor(path: IterableIterator<IWorldPosition>, msPerStep: number): IPathExecutor {
    let sw = SlidingWindow(path, { prevCapacity: 0, nextCapacity: 1 });
    // the first step should really be where you're at.
    sw.next();
    let value = sw.currValue;
    let done = sw.done;

    let msStep = 0;
    let delta = createDelta();
    
    function createDelta() {
        // (next - curr) / msPerStep
        let nextValue = sw.nextValues[0];
        return multiply(subtract(nextValue, value), 1 / msPerStep);
    }

    function update(msElapsed: number): void {
        if (done) { return; }
        msStep += msElapsed;

        if (msStep > msPerStep) {
            msStep -= msPerStep;
            let next = sw.next();
            delta = createDelta();
            // need to adjust with the remainder ms
            value = add(next.value, multiply(delta, msStep)); 
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
