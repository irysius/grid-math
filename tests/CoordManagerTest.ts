import { expect } from 'chai';
import { ICoordManager, CoordManager } from '@irysius/grid-math/CoordManager';
import { create as v } from '@irysius/grid-math/Vector2';
import { create as v_screen } from '@irysius/grid-math/ScreenPosition';
import { create as v_world } from '@irysius/grid-math/WorldPosition';
import { create as v_cell } from '@irysius/grid-math/CellCoord';
import { create as r } from '@irysius/grid-math/Rect';
import { create as r_screen } from '@irysius/grid-math/ScreenRect';
import Gravity from '@irysius/grid-math/Gravity';
import { cellOffset as makeCellOffset } from '@irysius/grid-math/Cell';

describe('CoordManager', () => {
    it('should only initialize with valid state', () => {
        let thunk1 = () => CoordManager(null);
        expect(thunk1).to.throw();

        let cellSize = { width: 10, height: 10 };
        let cellOffset = v(0, 0); // top-left
        let gridBounds = r_screen(10, 10, 580, 380);
        let position = v_world(100, 150);
        
        let badStates = [
            { cellSize: null, cellOffset: null, gridBounds: null, position: null },
            { cellSize: null, cellOffset, gridBounds, position },
            { cellSize, cellOffset: null, gridBounds, position },
            { cellSize, cellOffset, gridBounds: null, position },
            { cellSize, cellOffset, gridBounds, position: null }
        ];
        let thunks2 = badStates.map(badState => {
            return () => CoordManager({ state: badState });
        });
        thunks2.forEach(thunk => {
            expect(thunk).to.throw();
        });

        let notGoodEnoughState: any = {
            cellSize, cellOffset, gridBounds: r(10, 10, 580, 380), position: v(100, 150)
        };
        let thunk3 = () => CoordManager({ state: notGoodEnoughState });
        expect(thunk3).to.throw();
        
        let cm = CoordManager({ state: { cellSize, cellOffset, gridBounds, position }});
        expect(cm).to.be.an('object');
        // test only one function
        expect(cm.updateWithState).to.be.a('function');
    });
    context('given a valid CoordManager', () => {
        let coordManager: ICoordManager;
        beforeEach(() => {
            let cellSize = { width: 10, height: 10 };
            let cellOffset = makeCellOffset(cellSize, Gravity.Center);
            let gridBounds = r_screen(10, 10, 580, 380);
            let position = v_world(0, 0);
            let state = {
                cellSize, cellOffset, gridBounds, position
            };

            coordManager = CoordManager({ state });
        });
        afterEach(() => {
            coordManager = null
        });

        it("should be able to correctly get the world's top left", () => {
            let tl = coordManager.getWorldTopLeft();
            expect(tl).to.deep.equal(v_world(-290, -190));
        });
        it('should be able to correctly calculate cell coords', () => {
            // cell is 10x10 and centered, test bounds
            let toCellCoord = coordManager.toCellCoord;
            expect(toCellCoord(v_world(0, 0))).to.deep.equal(v_cell(0, 0));
            expect(toCellCoord(v_world(5, 5))).to.deep.equal(v_cell(1, 1));
            expect(toCellCoord(v_world(0, 5))).to.deep.equal(v_cell(0, 1));
            expect(toCellCoord(v_world(5, 0))).to.deep.equal(v_cell(1, 0));
            expect(toCellCoord(v_world(-5, 0))).to.deep.equal(v_cell(0, 0));
            expect(toCellCoord(v_world(-5, -5))).to.deep.equal(v_cell(0, 0));
            expect(toCellCoord(v_world(0, -5))).to.deep.equal(v_cell(0, 0));
            expect(toCellCoord(v_world(-6, -6))).to.deep.equal(v_cell(-1, -1));

            expect(toCellCoord(v_screen(0, 0))).to.deep.equal(v_cell(-30, -20));
            expect(toCellCoord(v_screen(300, 200))).to.deep.equal(v_cell(0, 0));
            expect(toCellCoord(v_screen(600, 400))).to.deep.equal(v_cell(30, 20));

            expect(toCellCoord(v_cell(-2, -2))).to.deep.equal(v_cell(-2, -2));
        }); 
        it('should be able to correctly calculate screen positions', () => {
            let toScreenPosition = coordManager.toScreenPosition;
            
            expect(toScreenPosition(v_world(0, 0))).to.deep.equal(v_screen(300, 200));
            expect(toScreenPosition(v_world(-300, -200))).to.deep.equal(v_screen(0, 0));
            expect(toScreenPosition(v_world(300, 200))).to.deep.equal(v_screen(600, 400));
            
            expect(toScreenPosition(v_cell(0, 0))).to.deep.equal(v_screen(295, 195));
            expect(toScreenPosition(v_cell(5, 5))).to.deep.equal(v_screen(345, 245));

            expect(toScreenPosition(v_screen(-15, 20))).to.deep.equal(v_screen(-15, 20));
        }); 
        it('should be able to correctly calculate world positions', () => {
            let toWorldPosition = coordManager.toWorldPosition;
            expect(toWorldPosition(v_screen(300, 200))).to.deep.equal(v_world(0, 0));
            expect(toWorldPosition(v_screen(0, 0))).to.deep.equal(v_world(-300, -200));
            expect(toWorldPosition(v_screen(600, 400))).to.deep.equal(v_world(300, 200));

            // expect to resolve to the top left of the cell no matter what (for rendering)
            expect(toWorldPosition(v_cell(0, 0))).to.deep.equal(v_world(-5, -5));
            expect(toWorldPosition(v_cell(5, 5))).to.deep.equal(v_world(45, 45));

            expect(toWorldPosition(v_world(-50, 50))).to.deep.equal(v_world(-50, 50));
        }); 
        it('should be able to correctly update with new state', () => {
            // test position change
            coordManager.updateWithState({ position: v_world(0, -25) }); // move up
            expect(coordManager.getWorldTopLeft()).to.deep.equal(v_world(-290, -215));
            coordManager.updateWithState({ position: v_world(0, 25) }); // move down
            expect(coordManager.getWorldTopLeft()).to.deep.equal(v_world(-290, -165));

            // test resize
            coordManager.updateWithState({ 
                position: v_world(0, 0), 
                gridBounds: r_screen(10, 10, 380, 580) 
            }); // move back & turn to portrait
            expect(coordManager.getWorldTopLeft()).to.deep.equal(v_world(-190, -290));
            coordManager.updateWithState({ gridBounds: r_screen(10, 10, 580, 380) }); // turn back to landscape

            // test cell dim change
            let newCellSize = { width: 20, height: 20 };
            let newOffset = makeCellOffset(newCellSize, Gravity.South);
            coordManager.updateWithState({ cellSize: newCellSize, cellOffset: newOffset });

            // test new bounds
            let toCellCoord = coordManager.toCellCoord;
            expect(toCellCoord(v_world(0, 0))).to.deep.equal(v_cell(0, 1));
            expect(toCellCoord(v_world(-10, -20))).to.deep.equal(v_cell(0, 0));
            expect(toCellCoord(v_world(-11, -21))).to.deep.equal(v_cell(-1, -1));
            expect(toCellCoord(v_world(10, -1))).to.deep.equal(v_cell(1, 0));
            expect(toCellCoord(v_world(10, 0))).to.deep.equal(v_cell(1, 1));
            expect(toCellCoord(v_world(10, 1))).to.deep.equal(v_cell(1, 1));
            expect(toCellCoord(v_world(10, 20))).to.deep.equal(v_cell(1, 2));
            expect(toCellCoord(v_world(-10, -1))).to.deep.equal(v_cell(0, 0));
            expect(toCellCoord(v_world(-10, 0))).to.deep.equal(v_cell(0, 1));
            expect(toCellCoord(v_world(-10, 1))).to.deep.equal(v_cell(0, 1));
            expect(toCellCoord(v_world(-10, 20))).to.deep.equal(v_cell(0, 2));

            let toWorldPosition = coordManager.toWorldPosition;
            // expect to resolve to the top left of the cell no matter what (for rendering)
            expect(toWorldPosition(v_cell(0, 0))).to.deep.equal(v_world(-10, -20));
            expect(toWorldPosition(v_cell(1, 1))).to.deep.equal(v_world(10, 0));
            expect(toWorldPosition(v_cell(-1, -1))).to.deep.equal(v_world(-30, -40));
        }); 
    });
});