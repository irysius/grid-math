import { expect } from 'chai';
import { Cell, Vector2, Gravity as _g } from '@irysius/grid-math';

let v = Vector2.create;
let { cellOffset } = Cell;
let { Gravity } = _g;

describe('Cell', () => {
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