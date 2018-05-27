export interface IVector2 {
    x: number; y: number;
    type?: string;
}

function checkType(a: IVector2, b: IVector2): string {
    if (a.type == null || b.type == null) {
        // Should at least one of the Vector2s be null, default to the opinionated Vector2's type.
        return a.type || b.type;
    } else {
        if (a.type !== b.type) {
            throw new Error(`Tried to operate on two different types of Vector2: ${a.type} & ${b.type}`);
        }
        return a.type;
    }
}

export function create(x: number, y: number, type?: string): IVector2 {
    let result: IVector2 = { x, y };
    if (type != null) { result.type = type; }
    return result;
}
export function zero(type?: string): IVector2 {
    let result: IVector2 = { x: 0, y: 0 };
    if (type != null) { result.type = type; }
    return result;
}
export function unit(type?: string): IVector2 {
    let result: IVector2 = { x: 1, y: 1 };
    if (type != null) { result.type = type; }
    return result;
}
export function isVector2(v: any, typeToCheck?: string|any): v is IVector2 {
    return !!(v &&
        typeof v.x === 'number' &&
        typeof v.y === 'number') &&
        (v.type == null || typeof v.type === 'string') &&
        (typeof typeToCheck !== 'string' || v.type === typeToCheck);
}
export function add<T extends IVector2>(a: T, b: T): T {
    let type = checkType(a, b);
    let result: any = {
        x: a.x + b.x,
        y: a.y + b.y
    };
    if (type != null) { result.type = type; }
    return result;
}
export function subtract<T extends IVector2>(a: T, b: T): T {
    let type = checkType(a, b);
    let result: any = {
        x: a.x - b.x,
        y: a.y - b.y
    };
    if (type != null) { result.type = type; }
    return result;
}
export function multiply<T extends IVector2>(v: T, k: number): T {
    let type = v.type;
    let result: any = {
        x: v.x * k,
        y: v.y * k
    };
    if (type != null) { result.type = type; }
    return result;
}
export function negate<T extends IVector2>(v: T): T {
    return multiply(v, -1);
}
export function areEqual(a: IVector2, b: IVector2, ignoreType?: boolean): boolean {
    return (ignoreType || a.type === b.type) && 
        (a.x === b.x && a.y === b.y);
}
export function closeEnough(e: number) {
    return function areCloseEnough(a: IVector2, b: IVector2, ignoreType?: boolean): boolean {
        return (ignoreType || a.type === b.type) &&
            (Math.abs(a.x - b.x) < e &&
            Math.abs(a.y - b.y) < e);
    }
}
export function clone<T extends IVector2>(v: T): T {
    return {...v as any};
}