import { ISize } from "./Size";
import Gravity, { northOrSouth, eastOrWest } from "./Gravity";

export interface ICellOffset {
    x: number; y: number;
}

export function cellOffset(cellSize: ISize, gravity: Gravity): ICellOffset {
    let ns = northOrSouth(gravity);
    let ew = eastOrWest(gravity);
    let x = (function () {
        switch (ew) {
            case Gravity.East:
                return cellSize.width;
            case Gravity.West:
                return 0;
            case Gravity.Center:
                return cellSize.width / 2;
        }
    })();
    let y = (function () {
        switch (ns) {
            case Gravity.North:
                return 0;
            case Gravity.South:
                return cellSize.height;
            case Gravity.Center:
                return cellSize.height / 2;
        }
    })();
    return { x, y };
}

// an offset of 0,0 indicates original for cell is top left
// an offset of 0.5,0.5 indicates cell center.