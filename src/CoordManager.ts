import * as Vector2 from "./Vector2";
import { IVector2, isVector2 } from "./Vector2";
import * as ScreenPosition from "./ScreenPosition";
import { IScreenPosition } from "./ScreenPosition";
import * as WorldPosition from "./WorldPosition";
import { IWorldPosition } from "./WorldPosition";
import * as CellCoord from "./CellCoord";
import { ICellCoord } from "./CellCoord";
import * as GridPosition from "./GridPosition";
import { IGridPosition } from "./GridPosition";
import { IRect, isRect } from "./Rect";
import { IScreenRect } from "./ScreenRect";
import * as ScreenRect from "./ScreenRect";
import { IWorldRect } from "./WorldRect";
import { ICellOffset } from "./Cell";
import { ISize, isSize } from "./Size";

export interface IState {
    cellSize: ISize;
    cellOffset: ICellOffset;
    gridBounds: IScreenRect;
    position: IWorldPosition;
}
interface ICache {
    gridBounds?: ICacheRect;
    worldTopLeft?: IWorldPosition;
}
export interface IOptions {
    state: IState;
}
interface ICacheRect {
    width: number; height: number;
    halfWidth: number; halfHeight: number;
}

export interface ICoordManager {
    updateWithState(newState: Partial<IState>): void;
    toWorldPosition(v: IVector2): IWorldPosition;
    toScreenPosition(v: IVector2): IScreenPosition;
    toCellCoord(v: IVector2): ICellCoord;
    getWorldTopLeft(): IWorldPosition;
}

function isState(value: any): value is IState {
    return (value &&
        isSize(value.cellSize) &&
        isVector2(value.cellOffset) &&
        isRect(value.gridBounds, ScreenRect.TYPE) &&
        isVector2(value.position, WorldPosition.TYPE));
}

export function CoordManager(options: IOptions): ICoordManager {
    let {
        state
    } = options;
    let cache: ICache = {};

    if (!isState(state)) {
        throw new Error('CoordManager initialized with invalid state.');
    }

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
        toWorldPosition,
        toScreenPosition,
        toCellCoord,
        getWorldTopLeft
    };
}