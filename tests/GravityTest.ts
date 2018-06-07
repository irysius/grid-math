import { expect } from 'chai';
import { Gravity as _g } from '@irysius/grid-math';
let {
    northOrSouth,
    eastOrWest,
    hasGravity,
    gravityToString,
    Gravity
} = _g;

describe('Gravity', () => {
    it('should be able to determine if a provided Gravity has the specified Gravities', () => {
        expect(hasGravity(Gravity.Center, Gravity.Center)).to.be.true;
        expect(hasGravity(Gravity.Center, Gravity.North)).to.be.false;
        expect(hasGravity(Gravity.North, Gravity.Center)).to.be.false;
        expect(hasGravity(Gravity.NorthWest, Gravity.North)).to.be.true;
        expect(hasGravity(Gravity.NorthWest, Gravity.South)).to.be.false;
        expect(hasGravity(Gravity.North|Gravity.South, Gravity.South)).to.be.true;
        expect(hasGravity(Gravity.North|Gravity.South, Gravity.South|Gravity.North)).to.be.true;
        expect(hasGravity(Gravity.North|Gravity.South, Gravity.South|Gravity.North|Gravity.East)).to.be.false;
        expect(hasGravity(Gravity.North|Gravity.South|Gravity.East|Gravity.West, Gravity.South|Gravity.North|Gravity.East)).to.be.true;
        expect(hasGravity(Gravity.North|Gravity.South, Gravity.East)).to.be.false;
    });
    it('should be able to generate an appropriate string, given a Gravity', () => {
        expect(gravityToString(Gravity.Center)).to.equal('Gravity.Center');
        expect(gravityToString(Gravity.South)).to.equal('Gravity.South');
        expect(gravityToString(Gravity.NorthEast)).to.equal('Gravity.NorthEast');
        expect(gravityToString(Gravity.South | Gravity.East | Gravity.North | Gravity.West)).to.equal('Gravity.NorthSouthEastWest');
    });
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

