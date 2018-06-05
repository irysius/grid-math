import * as math from '@irysius/grid-math';

function exists(type: string, item: any) {
    if (item != null) {
        console.log(`${type} exists`);
    } else {
        console.error(`${type} does not exist`);
    }
}

exists('Cell', math.Cell);
exists('CellCoord', math.CellCoord);
exists('CoordManager', math.CoordManager);
exists('GridPosition', math.GridPosition);
exists('Rect', math.Rect);
exists('ScreenPosition', math.ScreenPosition);
exists('ScreenRect', math.ScreenRect);
exists('Vector2', math.Vector2);
exists('WorldPosition', math.WorldPosition);
exists('WorldRect', math.WorldRect);
exists('pathfinding/PathGenerator', math.pathfinding.PathGenerator);


