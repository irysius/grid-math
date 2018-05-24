import * as Cell from '@irysius/grid-math/Cell';
import * as CellCoord from '@irysius/grid-math/CellCoord';
import * as CoordManager from '@irysius/grid-math/CoordManager';
import * as GridPosition from '@irysius/grid-math/GridPosition';
import * as Rect from '@irysius/grid-math/Rect';
import * as ScreenPosition from '@irysius/grid-math/ScreenPosition';
import * as ScreenRect from '@irysius/grid-math/ScreenRect';
import * as Vector2 from '@irysius/grid-math/Vector2';
import * as WorldPosition from '@irysius/grid-math/WorldPosition';
import * as WorldRect from '@irysius/grid-math/WorldRect';

function exists(type: string, item: any) {
    if (item != null) {
        console.log(`${type} exists`);
    } else {
        console.error(`${type} does not exist`);
    }
}

exists('Cell', Cell);
exists('CellCoord', CellCoord);
exists('CoordManager', CoordManager);
exists('GridPosition', GridPosition);
exists('Rect', Rect);
exists('ScreenPosition', ScreenPosition);
exists('ScreenRect', ScreenRect);
exists('Vector2', Vector2);
exists('WorldPosition', WorldPosition);
exists('WorldRect', WorldRect);