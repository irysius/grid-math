import { IVector2 } from "./Vector2";

export const TYPE: 'world' = 'world';
export interface IWorldPosition extends IVector2 {
    type: 'world';
}

export function create(x: number, y: number): IWorldPosition {
    return { x, y, type: 'world' };
}