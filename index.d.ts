declare module "@irysius/grid-math/Cell" {
    import { ISize } from "@irysius/grid-math/Rect";
    export interface ICellOffset {
        x: number;
        y: number;
    }
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
    export function northOrSouth(gravity: Gravity): Gravity;
    export function eastOrWest(gravity: Gravity): Gravity;
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
    import { ISize } from "@irysius/grid-math/Rect";
    import { IScreenRect } from "@irysius/grid-math/ScreenRect";
    import { ICellOffset } from "@irysius/grid-math/Cell";
    export interface IState {
        cellSize: ISize;
        /**
         *
         */
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
declare module "@irysius/grid-math/GridPosition" {
    import { IVector2 } from "@irysius/grid-math/Vector2";
    export interface IGridPosition extends IVector2 {
        type: 'grid';
    }
    export function create(x: number, y: number): IGridPosition;
}
declare module "@irysius/grid-math" {
    import * as _Cell from "@irysius/grid-math/Cell";
    import * as _CellCoord from "@irysius/grid-math/CellCoord";
    import * as _CoordManager from "@irysius/grid-math/CoordManager";
    import * as _GridPosition from "@irysius/grid-math/GridPosition";
    import * as _Rect from "@irysius/grid-math/Rect";
    import * as _ScreenPosition from "@irysius/grid-math/ScreenPosition";
    import * as _ScreenRect from "@irysius/grid-math/ScreenRect";
    import * as _Vector2 from "@irysius/grid-math/Vector2";
    import * as _WorldPosition from "@irysius/grid-math/WorldPosition";
    import * as _WorldRect from "@irysius/grid-math/WorldRect";
    export let Cell: typeof _Cell;
    export let CellCoord: typeof _CellCoord;
    export let CoordManager: typeof _CoordManager;
    export let GridPosition: typeof _GridPosition;
    export let Rect: typeof _Rect;
    export let ScreenPosition: typeof _ScreenPosition;
    export let ScreenRect: typeof _ScreenRect;
    export let Vector2: typeof _Vector2;
    export let WorldPosition: typeof _WorldPosition;
    export let WorldRect: typeof _WorldRect;
}
declare module "@irysius/grid-math/Rect" {
    export interface IRect extends ISize {
        x: number;
        y: number;
        type?: string;
    }
    export interface ISize {
        width: number;
        height: number;
    }
    export function empty(type?: string): IRect;
    export function fromClientBounds(v: any): IRect;
    export function isRect(v: IRect): boolean;
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
declare module "@irysius/grid-math/Vector2" {
    export interface IVector2 {
        x: number;
        y: number;
        type?: string;
    }
    export function zero(type?: string): IVector2;
    export function unit(type?: string): IVector2;
    export function isVector(v: IVector2): boolean;
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