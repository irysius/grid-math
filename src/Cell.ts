import { ISize } from "./Size";

export interface ICellOffset {
    x: number; y: number;
}

// bitwise works excellent here...
// nsew represented by bits

export enum Gravity {
    Center  = 0b0000,
    North   = 0b0001,
    South   = 0b0010,
    East    = 0b0100,
    West    = 0b1000,
    NorthEast   = 0b0101,
    NorthWest   = 0b1001,
    SouthEast   = 0b0110,
    SouthWest   = 0b1010
}

export function northOrSouth(gravity: Gravity): Gravity {
    let maskedGravity = 0b0011 & gravity;
    switch (maskedGravity) {
        case Gravity.North:
            return Gravity.North;
        case Gravity.South:
            return Gravity.South;
        case Gravity.Center:
            return Gravity.Center;
        default:
            throw new Error('Cannot be Gravity.North & Gravity.South at the same time.');
    }
}
export function eastOrWest(gravity: Gravity): Gravity {
    let maskedGravity = 0b1100 & gravity;
    switch (maskedGravity) {
        case Gravity.East:
            return Gravity.East;
        case Gravity.West:
            return Gravity.West;
        case Gravity.Center:
            return Gravity.Center;
        default:
            throw new Error('Cannot be Gravity.East & Gravity.West at the same time.');
    }
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