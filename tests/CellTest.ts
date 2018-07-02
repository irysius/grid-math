import { expect } from 'chai';
import Gravity from '@irysius/grid-math/Gravity';
import { create as v } from '@irysius/grid-math/Vector2';
import { cellOffset } from '@irysius/grid-math/Cell';

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