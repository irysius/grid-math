import { IVector2 } from "./Vector2";

export const TYPE: 'screen' = 'screen';
export interface IScreenPosition extends IVector2 {
    type: 'screen';
}

export function create(x: number, y: number): IScreenPosition {
    return { x, y, type: 'screen' };
}