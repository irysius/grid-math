export interface ISize {
    width: number;
    height: number;
}
export function create(width: number, height: number): ISize {
    return { width, height };
}
export function isSize(v: any): v is ISize {
    return (v &&
        typeof v.width === 'number' &&
        typeof v.height === 'number');
}