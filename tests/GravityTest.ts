import { expect } from 'chai';
import { Gravity as _g } from '@irysius/grid-math';
let {
    northOrSouth,
    eastOrWest,
    Gravity,
} = _g;

describe('Gravity', () => {
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
});

