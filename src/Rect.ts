export interface IRect extends ISize {
    x: number; y: number;
    type?: string;
}
export interface ISize {
    width: number;
    height: number;
}

export function empty(type?: string): IRect {
    let result: IRect = { x: 0, y: 0, width: 0, height: 0 };
    if (type != null) { result.type = type; }
    return result;
}
export function fromClientBounds(v): IRect {
    return {
        x: v.left, y: v.top,
        width: v.width, height: v.height
    };
}
export function isRect(v: IRect): boolean {
    return (v && 
        typeof v.x === 'number' &&
        typeof v.y === 'number' && 
        typeof v.width === 'number' &&
        typeof v.height === 'number') &&
        (v.type == null || typeof v.type === 'string');
}
export function areEqual(a: IRect, b: IRect, ignoreType?: boolean): boolean {
    return (ignoreType || a.type === b.type) && 
        (a.x === b.x && a.y === b.y &&
        a.width == b.width && a.height === b.height);
}
export function closeEnough(e: number) {
    return function areCloseEnough(a: IRect, b: IRect, ignoreType?: boolean): boolean {
        return (ignoreType || a.type === b.type) &&
            (Math.abs(a.x - b.x) < e &&
            Math.abs(a.y - b.y) < e &&
            Math.abs(a.width - b.width) < e &&
            Math.abs(a.height - b.height) < e);
    }
}
export function clone<T extends IRect>(v: T): T {
    return {...v as any};
}