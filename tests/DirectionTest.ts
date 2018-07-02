import { expect } from 'chai';
import Direction, { hasDirection, directionToString } from '@irysius/grid-math/Direction';

describe('Direction', () => {
    it('should be able to determine if a provided Direction has the specified Directions', () => {
        expect(hasDirection(Direction.None, Direction.None)).to.be.true;
        expect(hasDirection(Direction.None, Direction.North)).to.be.false;
        expect(hasDirection(Direction.North, Direction.None)).to.be.false;
        expect(hasDirection(Direction.NorthWest, Direction.North)).to.be.true;
        expect(hasDirection(Direction.NorthWest, Direction.South)).to.be.false;
        expect(hasDirection(Direction.North|Direction.South, Direction.South)).to.be.true;
        expect(hasDirection(Direction.North|Direction.South, Direction.South|Direction.North)).to.be.true;
        expect(hasDirection(Direction.North|Direction.South, Direction.South|Direction.North|Direction.East)).to.be.false;
        expect(hasDirection(Direction.North|Direction.South|Direction.East|Direction.West, Direction.South|Direction.North|Direction.East)).to.be.true;
        expect(hasDirection(Direction.North|Direction.South, Direction.East)).to.be.false;
    });
    it('should be able to generate an appropriate string, given a Direction', () => {
        expect(directionToString(Direction.None)).to.equal('Direction.None');
        expect(directionToString(Direction.South)).to.equal('Direction.South');
        expect(directionToString(Direction.NorthEast)).to.equal('Direction.NorthEast');
        expect(directionToString(Direction.South | Direction.East | Direction.North | Direction.West)).to.equal('Direction.NorthSouthEastWest');
    });
});