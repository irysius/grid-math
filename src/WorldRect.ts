import { IRect } from "./Rect";

export const TYPE: 'world' = 'world';
export interface IWorldRect extends IRect {
    type: 'world';
}

export function create(x: number, y: number, width: number, height: number): IWorldRect {
    return { x, y, width, height, type: 'world' };
}