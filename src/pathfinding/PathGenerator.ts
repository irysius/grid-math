import { ICellCoord, create as c } from "../CellCoord";
import  { IVector2, add, subtract } from "../Vector2";
import Direction, { directionToString } from "../Direction";
import { SlidingWindow } from "../helpers/Iterable";

function simpleSquare(start: ICellCoord) {
    let steps = [
        add(start, c(0, 1)),
        add(start, c(1, 1)),
        add(start, c(1, 0)),
        start
    ];
    return steps;
}

type Steps = ICellCoord[];
type StepsGenerator = (start: ICellCoord) => Steps;

// paths should only move forward.
// if you need a reverse path, provide reversed steps

// To support forward and backwards
// interface IWrapOptions {
//     over(): void;
//     under(): void;
// }
// function wrapIndex(count: number, options?: IWrapOptions) {
//     return function (index: number) {
//         if (index >= count) { 
//             if (options) { options.over(); }
//             return 0; 
//         }
//         if (index < 0) { 
//             if (options) { options.under(); }
//             return count - 1; 
//         }
//         return index;
//     };
// }

/**
 * Returns an iterator for the steps provided.
 * @param steps 
 * @param timesToLoop Number of times to loop through the steps. For infinite loop, set this to 0.
 */
export function createPath(steps: IVector2[], timesToLoop: number = 0) {
    function* inner() {
        let index = 0, loopCount = 0, stepCount = steps.length;
        let cond = () => {
            return timesToLoop > 0
                ? (loopCount < timesToLoop) 
                : true;
        };
        
        while (cond()) {
            yield steps[index];
            index++;
            if (index >= stepCount) {
                index = 0;
                if (timesToLoop > 0) {
                    loopCount++;
                }
            }
        }
    }
    return inner();
}


function getDirection(before: IVector2, after?: IVector2): Direction {
    if (!after) { return Direction.None; }

    let delta = subtract(after, before);
    let ew = (function () {
        if (delta.x > 0) {
            return Direction.East;
        } else if (delta.x < 0) {
            return Direction.West;
        } else {
            return Direction.None;
        }
    })();
    let ns = (function () {
        if (delta.y > 0) {
            return Direction.South;
        } else if (delta.y < 0) {
            return Direction.North;
        } else {
            return Direction.None;
        }
    })();

    return ew | ns;
}

export function test() {
    let path = createPath(simpleSquare(c(0, 0)), 2);
    let mw = SlidingWindow(path, { prevCapacity: 0, nextCapacity: 1 });
    mw.currValue
    mw.nextValues[0]
    let sample = mw;

    function mwLoop() {
        mw.next();
        let d = getDirection(mw.currValue, mw.nextValues[0]);
        console.log(directionToString(d));
    }
    // mwLoop();
    // mwLoop();
    // mwLoop();
    // mwLoop();
    // mwLoop();
    // mwLoop();
    // mwLoop();
    // mwLoop();
    // mwLoop();
    // mwLoop();
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());
    console.log(sample.next());

}

