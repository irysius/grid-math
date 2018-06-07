import { expect } from 'chai';
import * as math from '@irysius/grid-math';
let {
    create: c
} = math.CellCoord;
let {
    simpleSquare,
    createPath
} = math.pathfinding.tools;
let {
    take
} = math.helpers.Iterable;

describe.only('pathfinding/tools', () => {
    it('should be able to create square steps', () => {
        // clockwise, going down first
        let steps = simpleSquare(c(1, 1));
        let expected = [
            c(1, 1), c(1, 2), c(2, 2), c(2, 1)
        ];
        expect(steps).to.deep.equal(expected);
    });
    it('should be able to generate an iterator from a list of steps', () => {
        let steps = simpleSquare(c(0, 0));
        // We will cap infinite loop test at 10 loops, so 40 items
        expect(take(40)(createPath(steps))).to.have.lengthOf(40);
        expect(take(40)(createPath(steps, 0))).to.have.lengthOf(40);
        expect(take(40)(createPath(steps, 1))).to.have.lengthOf(4);
        expect(take(40)(createPath(steps, 2))).to.have.lengthOf(8);
        expect(take(40)(createPath(steps, 3))).to.have.lengthOf(12);
    });

});