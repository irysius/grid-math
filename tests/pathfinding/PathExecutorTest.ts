import { expect } from 'chai';
import * as math from '@irysius/grid-math';
import { ICoordManager } from '@irysius/grid-math/CoordManager';
import { ICellCoord } from '@irysius/grid-math/CellCoord';
import { ICellOffset } from '@irysius/grid-math/Cell';
import { exec } from 'child_process';
let { Gravity } = math.Gravity;
let { cellOffset: makeCellOffset } = math.Cell;
let { add } = math.Vector2;
let { create: v_cell } = math.CellCoord;
let { create: v_world } = math.WorldPosition;
let { create: r_screen } = math.ScreenRect
let { CoordManager } = math.CoordManager;
let { simpleSquare, createPath } = math.pathfinding.tools;
let { PathExecutor } = math.pathfinding.PathExecutor;
let { map } = math.helpers.Iterable;

describe('pathfinding/PathExecutor', () => {
    let coordManager: ICoordManager;
    let cellOffset: ICellOffset;
    beforeEach(() => {
        let cellSize = { width: 10, height: 10 };
        cellOffset = makeCellOffset(cellSize, Gravity.NorthWest);
        let gridBounds = r_screen(10, 10, 580, 380);
        let position = v_world(0, 0);
        let state = {
            cellSize, cellOffset, gridBounds, position
        };

        coordManager = CoordManager({ state });
    });
    afterEach(() => {
        coordManager = null;
        cellOffset = null;
    });
    it('should be able to update the tracked value on time ticks', () => {
        function toWorldPosition(value: ICellCoord) {
            return coordManager.toWorldPosition(value); // always top-left
        }
        let steps = simpleSquare(v_cell(0, 0));
        let path = createPath(steps);
        let worldPath = map(toWorldPosition)(path);
        let executor = PathExecutor(worldPath, 5000);
        expect(executor.value).to.deep.equal(v_world(0, 0));
        expect(executor.done).to.be.false;

        executor.update(5000);
        expect(executor.value).to.deep.equal(v_world(0, 10));

        executor.update(2500);
        expect(executor.value).to.deep.equal(v_world(5, 10));

        executor.update(5000); // tests overflow
        expect(executor.value).to.deep.equal(v_world(10, 5));

        executor.update(0);
        expect(executor.value).to.deep.equal(v_world(10, 5));

        executor.update(10000); // tests more than one overflow
        expect(executor.value).to.deep.equal(v_world(0, 5));
        expect(executor.done).to.be.false;
    });
    it('should be able to correct end updates on finite paths', () => {
        function toWorldPosition(value: ICellCoord) {
            return coordManager.toWorldPosition(value); // always top-left
        }
        // end at the beginning
        let steps = [...simpleSquare(v_cell(0, 0)), v_cell(0, 0)]; 
        // or add an option to createPath to close the path?
        let path = createPath(steps, 1);
        let worldPath = map(toWorldPosition)(path);
        let executor = PathExecutor(worldPath, 5000);
        expect(executor.value).to.deep.equal(v_world(0, 0));
        expect(executor.done).to.be.false;

        executor.update(5000);
        expect(executor.value).to.deep.equal(v_world(0, 10));

        executor.update(12500);
        expect(executor.value).to.deep.equal(v_world(5, 0));

        executor.update(100000);
        expect(executor.value).to.deep.equal(v_world(0, 0));
        expect(executor.done).to.be.true;
    });
});