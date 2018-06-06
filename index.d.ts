declare module "@irysius/grid-math/Cell" {
    import { ISize } from "@irysius/grid-math/Size";
    import Gravity from "@irysius/grid-math/Gravity";
    export interface ICellOffset {
        x: number;
        y: number;
    }
    export function cellOffset(cellSize: ISize, gravity: Gravity): ICellOffset;
}
declare module "@irysius/grid-math/CellCoord" {
    import { IVector2 } from "@irysius/grid-math/Vector2";
    export const TYPE: 'cell';
    export interface ICellCoord extends IVector2 {
        type: 'cell';
    }
    export function create(x: number, y: number): ICellCoord;
}
declare module "@irysius/grid-math/CoordManager" {
    import { IVector2 } from "@irysius/grid-math/Vector2";
    import { IScreenPosition } from "@irysius/grid-math/ScreenPosition";
    import { IWorldPosition } from "@irysius/grid-math/WorldPosition";
    import { ICellCoord } from "@irysius/grid-math/CellCoord";
    import { IScreenRect } from "@irysius/grid-math/ScreenRect";
    import { ICellOffset } from "@irysius/grid-math/Cell";
    import { ISize } from "@irysius/grid-math/Size";
    export interface IState {
        cellSize: ISize;
        cellOffset: ICellOffset;
        gridBounds: IScreenRect;
        position: IWorldPosition;
    }
    export interface IOptions {
        state: IState;
    }
    export interface ICoordManager {
        updateWithState(newState: Partial<IState>): void;
        toWorldPosition(v: IVector2): IWorldPosition;
        toScreenPosition(v: IVector2): IScreenPosition;
        toCellCoord(v: IVector2): ICellCoord;
        getWorldTopLeft(): IWorldPosition;
    }
    export function CoordManager(options: IOptions): ICoordManager;
}
declare module "@irysius/grid-math/Direction" {
    export enum Direction {
        None = 0,
        North = 1,
        South = 2,
        East = 4,
        West = 8,
        NorthEast = 5,
        NorthWest = 9,
        SouthEast = 6,
        SouthWest = 10,
    }
    export function isDirection(value: Direction, targetDirection: Direction): boolean;
    export function directionToString(value: Direction): string;
    export default Direction;
}
declare module "@irysius/grid-math/Gravity" {
    export enum Gravity {
        Center = 0,
        North = 1,
        South = 2,
        East = 4,
        West = 8,
        NorthEast = 5,
        NorthWest = 9,
        SouthEast = 6,
        SouthWest = 10,
    }
    export function isGravity(value: Gravity, targetGravity: Gravity): boolean;
    export function gravityToString(value: Gravity): string;
    export function northOrSouth(gravity: Gravity): Gravity;
    export function eastOrWest(gravity: Gravity): Gravity;
    export default Gravity;
}
declare module "@irysius/grid-math/GridPosition" {
    import { IVector2 } from "@irysius/grid-math/Vector2";
    export interface IGridPosition extends IVector2 {
        type: 'grid';
    }
    export function create(x: number, y: number): IGridPosition;
}
declare module "@irysius/grid-math" {
    import * as _Iterable from "@irysius/grid-math/helpers/Iterable";
    import * as _PathExecutor from "@irysius/grid-math/pathfinding/PathExecutor";
    import * as _tools from "@irysius/grid-math/pathfinding/tools";
    import * as _Cell from "@irysius/grid-math/Cell";
    import * as _CellCoord from "@irysius/grid-math/CellCoord";
    import * as _CoordManager from "@irysius/grid-math/CoordManager";
    import * as _Direction from "@irysius/grid-math/Direction";
    import * as _Gravity from "@irysius/grid-math/Gravity";
    import * as _GridPosition from "@irysius/grid-math/GridPosition";
    import * as _Rect from "@irysius/grid-math/Rect";
    import * as _ScreenPosition from "@irysius/grid-math/ScreenPosition";
    import * as _ScreenRect from "@irysius/grid-math/ScreenRect";
    import * as _Size from "@irysius/grid-math/Size";
    import * as _Vector2 from "@irysius/grid-math/Vector2";
    import * as _WorldPosition from "@irysius/grid-math/WorldPosition";
    import * as _WorldRect from "@irysius/grid-math/WorldRect";
    export let helpers: {
        Iterable: typeof _Iterable;
    };
    export let pathfinding: {
        PathExecutor: typeof _PathExecutor;
        tools: typeof _tools;
    };
    export let Cell: typeof _Cell;
    export let CellCoord: typeof _CellCoord;
    export let CoordManager: typeof _CoordManager;
    export let Direction: typeof _Direction;
    export let Gravity: typeof _Gravity;
    export let GridPosition: typeof _GridPosition;
    export let Rect: typeof _Rect;
    export let ScreenPosition: typeof _ScreenPosition;
    export let ScreenRect: typeof _ScreenRect;
    export let Size: typeof _Size;
    export let Vector2: typeof _Vector2;
    export let WorldPosition: typeof _WorldPosition;
    export let WorldRect: typeof _WorldRect;
}
declare module "@irysius/grid-math/Rect" {
    import { ISize } from "@irysius/grid-math/Size";
    export interface IRect extends ISize {
        x: number;
        y: number;
        type?: string;
    }
    export function create(x: number, y: number, width: number, height: number, type?: string): IRect;
    export function empty(type?: string): IRect;
    export function fromClientBounds(v: any): IRect;
    export function isRect(v: any, typeToCheck?: string | any): v is IRect;
    export function areEqual(a: IRect, b: IRect, ignoreType?: boolean): boolean;
    export function closeEnough(e: number): (a: IRect, b: IRect, ignoreType?: boolean) => boolean;
    export function clone<T extends IRect>(v: T): T;
}
declare module "@irysius/grid-math/ScreenPosition" {
    import { IVector2 } from "@irysius/grid-math/Vector2";
    export const TYPE: 'screen';
    export interface IScreenPosition extends IVector2 {
        type: 'screen';
    }
    export function create(x: number, y: number): IScreenPosition;
}
declare module "@irysius/grid-math/ScreenRect" {
    import { IRect } from "@irysius/grid-math/Rect";
    export const TYPE: 'screen';
    export interface IScreenRect extends IRect {
        type: 'screen';
    }
    export function create(x: number, y: number, width: number, height: number): IScreenRect;
}
declare module "@irysius/grid-math/Size" {
    export interface ISize {
        width: number;
        height: number;
    }
    export function create(width: number, height: number): ISize;
    export function isSize(v: any): v is ISize;
}
declare module "@irysius/grid-math/Vector2" {
    export interface IVector2 {
        x: number;
        y: number;
        type?: string;
    }
    export function create(x: number, y: number, type?: string): IVector2;
    export function zero(type?: string): IVector2;
    export function unit(type?: string): IVector2;
    export function isVector2(v: any, typeToCheck?: string | any): v is IVector2;
    export function add<T extends IVector2>(a: T, b: T): T;
    export function subtract<T extends IVector2>(a: T, b: T): T;
    export function multiply<T extends IVector2>(v: T, k: number): T;
    export function negate<T extends IVector2>(v: T): T;
    export function areEqual(a: IVector2, b: IVector2, ignoreType?: boolean): boolean;
    export function closeEnough(e: number): (a: IVector2, b: IVector2, ignoreType?: boolean) => boolean;
    export function clone<T extends IVector2>(v: T): T;
}
declare module "@irysius/grid-math/WorldPosition" {
    import { IVector2 } from "@irysius/grid-math/Vector2";
    export const TYPE: 'world';
    export interface IWorldPosition extends IVector2 {
        type: 'world';
    }
    export function create(x: number, y: number): IWorldPosition;
}
declare module "@irysius/grid-math/WorldRect" {
    import { IRect } from "@irysius/grid-math/Rect";
    export const TYPE: 'world';
    export interface IWorldRect extends IRect {
        type: 'world';
    }
    export function create(x: number, y: number, width: number, height: number): IWorldRect;
}
declare module "@irysius/grid-math/helpers/Iterable" {
    export interface ISlidingWindowOptions {
        prevCapacity: number;
        nextCapacity: number;
    }
    export interface ISlidingWindow<T> {
        next(): {
            value: T;
            done: boolean;
        };
        readonly prevValues: T[];
        readonly currValue: T;
        readonly nextValues: T[];
        readonly done: boolean;
    }
    export function SlidingWindow<T>(collection: IterableIterator<T>, options: ISlidingWindowOptions): ISlidingWindow<T>;
    export function isIterator<T = any>(value: any): value is IterableIterator<T>;
    export function map<T, U>(mapper: (x: T) => U): (collection: IterableIterator<T>) => IterableIterator<U>;
    export function flatten(): <T>(collection: IterableIterator<T | IterableIterator<T>>) => IterableIterator<T>;
    export function filter<T>(filterer: (x: T) => boolean): (collection: IterableIterator<T>) => IterableIterator<T>;
    export function zip<A, B>(collectionA: IterableIterator<A>, collectionB: IterableIterator<B>): IterableIterator<[A, B]>;
    export type IteratorPipe = (x: IterableIterator<any>) => IterableIterator<any>;
    export function flow<A = any, Z = any>(...pipes: IteratorPipe[]): (collection: IterableIterator<A>) => IterableIterator<Z>;
    export function skip(count: number): <T>(collection: IterableIterator<T>) => void;
    export function take(count: number): <T>(collection: IterableIterator<T>) => T[];
    export function skipTake(_skip: number, _take: number): <T>(collection: IterableIterator<T>) => T[];
    export function fromArray<T>(items: T[]): IterableIterator<T>;
}
declare module "@irysius/grid-math/pathfinding/PathExecutor" {
    import { IWorldPosition } from "@irysius/grid-math/WorldPosition";
    export interface IPathExecutor {
        update(msElapsed: number): void;
        readonly value: IWorldPosition;
        readonly done: boolean;
    }
    export function PathExecutor(path: IterableIterator<IWorldPosition>, msPerStep: number): IPathExecutor;
}
declare module "@irysius/grid-math/pathfinding/tools" {
    import { ICellCoord } from "@irysius/grid-math/CellCoord";
    import { IVector2 } from "@irysius/grid-math/Vector2";
    export function simpleSquare(start: ICellCoord): ICellCoord[];
    /**
     * Returns an iterator for the steps provided.
     * @param steps
     * @param timesToLoop Number of times to loop through the steps. For infinite loop, set this to 0.
     */
    export function createPath<T extends IVector2>(steps: T[], timesToLoop?: number): IterableIterator<T>;
    export function test(): void;
}