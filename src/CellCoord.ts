import { IVector2 } from "./Vector2";

export const TYPE: 'cell' = 'cell';
export interface ICellCoord extends IVector2 {
    type: 'cell';
}

export function create(x: number, y: number): ICellCoord {
    return { x, y, type: 'cell' };
}