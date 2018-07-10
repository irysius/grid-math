import * as Vector2 from "./Vector2";
import { IVector2, isVector2, create as v } from "./Vector2";
import * as ScreenPosition from "./ScreenPosition";
import { IScreenPosition } from "./ScreenPosition";
import * as WorldPosition from "./WorldPosition";
import { IWorldPosition, create as v_world } from "./WorldPosition";
import * as CellCoord from "./CellCoord";
import { ICellCoord } from "./CellCoord";
import { IGridPosition } from "./GridPosition";
import { IRect, isRect } from "./Rect";
import { IScreenRect, create as r_screen } from "./ScreenRect";
import * as ScreenRect from "./ScreenRect";
import { ICellOffset } from "./Cell";
import { ISize, isSize, create as s } from "./Size";

export type IOptions = IClientState|IServerState;
export interface IState {
    gridBounds: IScreenRect;
    position: IWorldPosition;
    cellSize: ISize;
    cellOffset: ICellOffset;
}
/**
 * State for the CoordManager, on the client side. Clients should receive cellSize and cellOffset from the server.
 */
export interface IClientState {
    gridBounds: IScreenRect;
    position: IWorldPosition;
}
interface IClientStateInner extends IClientState {
    cellSize?: ISize;
    cellOffset?: ICellOffset;
}
/**
 * State for the CoordManager, on the server side. Servers do not care about grid bounds or camera position.
 */
export interface IServerState {
    cellSize: ISize;
    cellOffset: ICellOffset;
}
interface IServerStateInner extends IServerState {
    gridBounds?: IScreenRect;
    position?: IWorldPosition;
}
interface ICache {
    gridBounds?: ICacheRect;
    worldTopLeft?: IWorldPosition;
}
interface ICacheRect {
    width: number; height: number;
    halfWidth: number; halfHeight: number;
}

export interface ICoordManager {
    getState(): IState;
    updateWithState(newState: Partial<IState>): void;
    toWorldPosition(v: IVector2): IWorldPosition;
    toScreenPosition(v: IVector2): IScreenPosition;
    toCellCoord(v: IVector2): ICellCoord;
    getWorldTopLeft(): IWorldPosition;
}

function isClientState(value: any): value is IClientState {
    return (value &&
        isRect(value.gridBounds, ScreenRect.TYPE) &&
        isVector2(value.position, WorldPosition.TYPE));
}
function isServerState(value: any): value is IServerState {
    return (value &&
        isSize(value.cellSize) &&
        isVector2(value.cellOffset));
}
function fillClientState(state: IClientStateInner): IState {
    return {
        gridBounds: state.gridBounds,
        position: state.position,
        cellOffset: isVector2(state.cellOffset) ? state.cellOffset : v(0, 0),
        cellSize: isSize(state.cellSize) ? state.cellSize : s(0, 0) 
    };
}
function fillServerState(state: IServerStateInner): IState {
    return {
        gridBounds: isRect(state.gridBounds) ? state.gridBounds : r_screen(0, 0, 0, 0),
        position: isVector2(state.position, WorldPosition.TYPE) ? state.position : v_world(0, 0),
        cellOffset: state.cellOffset,
        cellSize: state.cellSize 
    };
}

export function CoordManager(options: IOptions): ICoordManager {
    let state: IState;
    if (isClientState(options)) {
        state = fillClientState(options);
    } else if (isServerState(options)) {
        state = fillServerState(options);
    } else {
        throw new Error('CoordManager initialized with invalid state.');
    }
    
    let cache: ICache = {};

    function getGridBounds(): ICacheRect {
        if (!cache.gridBounds) {
            let { gridBounds } = state;
            cache.gridBounds = {
                width: gridBounds.width,
                height: gridBounds.height,
                halfWidth: gridBounds.width / 2,
                halfHeight: gridBounds.height / 2
            };
        }
        return cache.gridBounds;
    }
    function getWorldTopLeft(): IWorldPosition {
        if (!cache.worldTopLeft) {
            let { position } = state;
            let gridBounds = getGridBounds();
            cache.worldTopLeft = {
                x: position.x - gridBounds.halfWidth, 
                y: position.y - gridBounds.halfHeight, 
                type: 'world'
            };
        }
        return cache.worldTopLeft;
    }

    function getState(): IState {
        return {
            ...state
        };
    }
    function updateWithState(newState: Partial<IState>) {
        state = {
            ...state,
            ...newState
        };

        // We anticipate cellSize and cellOffset to not change often
        // followed by gridBounds
        // followed by position, which should change the most frequently
        let changedFields = Object.keys(newState);
        if (changedFields.indexOf('gridBounds') !== -1) {
            delete cache.gridBounds;
        }
        if (changedFields.indexOf('position') !== -1) {
            delete cache.worldTopLeft;
        }
    }

    function sp2gp(p: IScreenPosition): IGridPosition {
        let { gridBounds } = state;
        let { x: x$, y: y$ } = gridBounds;
        let { x, y } = Vector2.subtract(p, { x: x$, y: y$ });
        return { x, y, type: 'grid' }
    }
    function sp2wp(p: IScreenPosition): IWorldPosition {
        let gp = sp2gp(p);
        let topLeft = getWorldTopLeft();
        return {
            x: topLeft.x + gp.x,
            y: topLeft.y + gp.y,
            type: 'world'
        };
    }
    function sp2cell(p: IScreenPosition): ICellCoord {
        let wp = sp2wp(p);
        return wp2cell(wp);
    }
    function wp2gp(p: IWorldPosition): IGridPosition {
        let { x, y } = Vector2.subtract(p, getWorldTopLeft());
        return { x, y, type: 'grid' };
    }
    function wp2sp(p: IWorldPosition): IScreenPosition {
        let { gridBounds } = state;
        let { x: x$, y: y$ } = gridBounds;
        let { x, y } = Vector2.add(
            { x: x$, y: y$ }, wp2gp(p));
        return { x, y, type: 'screen' };
    }
    function wp2cell(p: IWorldPosition): ICellCoord {
        let { cellSize, cellOffset } = state;
        return {
            x: Math.floor((p.x + cellOffset.x) / cellSize.width),
            y: Math.floor((p.y + cellOffset.y) / cellSize.height),
            type: 'cell'
        };
    }
    function cell2wp(p: ICellCoord): IWorldPosition {
        let { cellSize, cellOffset } = state;
        return {
            x: p.x * cellSize.width - cellOffset.x,
            y: p.y * cellSize.height - cellOffset.y,
            type: 'world'
        };
    }
    function cell2sp(p: ICellCoord): IScreenPosition {
        let wp = cell2wp(p);
        return wp2sp(wp);
    }

    function toWorldPosition(v: IVector2): IWorldPosition {
        switch (v.type) {
            case WorldPosition.TYPE:
                return v as IWorldPosition;
            case ScreenPosition.TYPE:
                return sp2wp(v as IScreenPosition);
            case CellCoord.TYPE:
                return cell2wp(v as ICellCoord);
            default:
                throw new Error(`Tried to convert an invalid Vector2 into a WorldPosition: ${v}`);
        }
    }
    function toScreenPosition(v: IVector2): IScreenPosition {
        switch (v.type) {
            case WorldPosition.TYPE:
                return wp2sp(v as IWorldPosition);
            case ScreenPosition.TYPE:
                return v as IScreenPosition;
            case CellCoord.TYPE:
                return cell2sp(v as ICellCoord);
            default:
                throw new Error(`Tried to convert an invalid Vector2 into a ScreenPosition: ${v}`);
        }
    }
    function toCellCoord(v: IVector2): ICellCoord {
        switch (v.type) {
            case WorldPosition.TYPE:
                return wp2cell(v as IWorldPosition);
            case ScreenPosition.TYPE:
                return sp2cell(v as IScreenPosition);
            case CellCoord.TYPE:
                return v as ICellCoord;
            default:
                throw new Error(`Tried to convert an invalid Vector2 into a CellCoord: ${v}`);
        }
    }
    
    return {
        updateWithState,
        getState,
        toWorldPosition,
        toScreenPosition,
        toCellCoord,
        getWorldTopLeft
    };
}