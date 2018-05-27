import { expect } from 'chai';
import { 
    Cell,
    CoordManager as _cm, 
    Vector2, WorldPosition,
    Rect, ScreenRect 
} from '@irysius/grid-math';
import { ICoordManager } from '@irysius/grid-math/CoordManager';
import { Gravity } from '@irysius/grid-math/Cell';
let { CoordManager } = _cm;
let { cellOffset: makeCellOffset } = Cell;

let v = Vector2.create;
let v_world = WorldPosition.create;
let r = Rect.create;
let r_screen = ScreenRect.create

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
            let position = v_world(100, 150);
            let state = {
                cellSize, cellOffset, gridBounds, position
            };

            coordManager = CoordManager({ state });
        });
        afterEach(() => {
            coordManager = null
        });

        it("should be able to correctly get the world's top left", () => {
            coordManager.getWorldTopLeft();
        });
        it('should be able to correctly calculate cell coords', () => {
            coordManager.toCellCoord(null);
        }); 
        it('should be able to correctly calculate screen positions', () => {
            coordManager.toScreenPosition(null);
        }); 
        it('should be able to correctly calculate world positions', () => {
            coordManager.toWorldPosition(null);
        }); 
        it('should be able to correctly update with new state', () => {
            // test cell dim change
            // test resize
            // test position change
            coordManager.updateWithState(null);
        }); 
    });
});