import { expect } from 'chai';
import { Cell, Vector2 } from '@irysius/grid-math';
let v = Vector2.create;
let {
    northOrSouth,
    eastOrWest,
    Gravity,
    cellOffset
} = Cell;

describe('Cell', () => {
    it('should be able to determine north OR south', () => {
        let tests = [
            Gravity.North, Gravity.NorthEast, Gravity.SouthWest, Gravity.East, Gravity.Center,
            Gravity.East | Gravity.West
        ];
        let expected = [
            Gravity.North, Gravity.North, Gravity.South, Gravity.Center, Gravity.Center,
            Gravity.Center
        ];
        let results = tests.map(northOrSouth);
        expect(results).to.deep.equal(expected);

        let thunk = () => northOrSouth(Gravity.North | Gravity.South);
        expect(thunk).to.throw();
    });
    it('should be able to determine east OR west', () => {
        let tests = [
            Gravity.North, Gravity.NorthEast, Gravity.SouthWest, Gravity.East, Gravity.Center,
            Gravity.North | Gravity.South
        ];
        let expected = [
            Gravity.Center, Gravity.East, Gravity.West, Gravity.East, Gravity.Center,
            Gravity.Center
        ];
        let results = tests.map(eastOrWest);
        expect(results).to.deep.equal(expected);

        let thunk = () => eastOrWest(Gravity.East | Gravity.West);
        expect(thunk).to.throw();
    });
    it('should be able to generate a cell offset', () => {
        let cellSize = { width: 5, height: 5 };
        let gravities = [
            Gravity.Center, Gravity.North, Gravity.South, Gravity.East, Gravity.West,
            Gravity.NorthEast, Gravity.NorthWest, Gravity.SouthEast, Gravity.SouthWest
        ];
        let expected = [
            v(2.5, 2.5), v(2.5, 0), v(2.5, 5), v(5, 2.5), v(0, 2.5),
            v(5, 0), v(0, 0), v(5, 5), v(0, 5)
        ];

        let results = gravities.map(g => cellOffset(cellSize, g));
        expect(results).to.deep.equal(expected);
    });
});