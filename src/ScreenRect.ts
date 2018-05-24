import { IRect } from "./Rect";

export const TYPE: 'screen' = 'screen';
export interface IScreenRect extends IRect {
    type: 'screen';
}

export function create(x: number, y: number, width: number, height: number): IScreenRect {
    return { x, y, width, height, type: 'screen' };
}