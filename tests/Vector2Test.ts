import { expect } from 'chai';
import { Vector2 } from '@irysius/grid-math';
let v = Vector2.create;

describe('Vector2', () => {
    let testVectors = [
        v(0, 0),
        v(1, 1, 'debug'),
        v(-1, -2),
        { x: 2, y: -1, other: 'meta' }
    ];
    it('should be able to create vectors', () => {
        expect(Vector2.create(1, 1)).to.deep.equal({ x: 1, y: 1 });
        expect(Vector2.create(2, 1, 'debug')).to.deep.equal({ x: 2, y: 1, type: 'debug' });
    });
    it('should correctly generate empty vectors', () => {
        expect(Vector2.zero()).to.deep.equal(v(0, 0));
        expect(Vector2.zero('debug')).to.deep.equal(v(0, 0, 'debug'));
    });
    it('should correctly generate unit vectors', () => {
        expect(Vector2.unit()).to.deep.equal(v(1, 1));
        expect(Vector2.unit('debug')).to.deep.equal(v(1, 1, 'debug'));
    });
    it('should be able to validate if something is a vector', () => {
        let isVector2 = Vector2.isVector2;
        let composite = {};
        Object.defineProperty(composite, 'x', {
            get: () => 1
        });
        Object.defineProperty(composite, 'y', {
            get: () => 1
        });
        let vectors = [
            { x: 0, y: 1 }, {}, { x: '0', y: '1' }, { x: 1 }, { y: 1 },
            { x: 1, y: 1, sample: 'test' }, { x: 1, y: 1, type: 'debug' }, { x: 1, y: 1, type: 0 }, 
            composite, null
        ];
        let expected = [
            true, false, false, false, false,
            true, true, false,
            true, false
        ];

        let results = vectors.map(isVector2);
        expect(results).to.deep.equal(expected);

        let typedVectors = [
            v(2, 3), v(2, 3, 'debug'), v(2, 3, 'test')
        ];
        let typedExpectations = [
            false, true, false
        ];
        let typedResults = typedVectors.map(x => isVector2(x, 'debug'));
        expect(typedResults).to.deep.equal(typedExpectations);
    });
    it('should be able to add two vectors together', () => {
        let add = Vector2.add;
        expect(add(v(1, 1), v(2, 2))).to.deep.equal(v(3, 3));
        expect(add(v(-1, 1), v(1, -1))).to.deep.equal(v(0, 0));
        expect(add(v(1, 1, 'debug'), v(2, 2))).to.deep.equal(v(3, 3, 'debug'));
        expect(add(v(1, 1), v(2, 2, 'debug'))).to.deep.equal(v(3, 3, 'debug'));

        let thunk = () => add(v(1, 1, 'debug'), v(2, 2, 'test'));
        expect(thunk).to.throw();
    });
    it('should be able to subtract one vector from another', () => {
        let subtract = Vector2.subtract;
        expect(subtract(v(1, 1), v(2, 2))).to.deep.equal(v(-1, -1));
        expect(subtract(v(1, 1), v(1, 1))).to.deep.equal(v(0, 0));
        expect(subtract(v(-1, -1), v(-1, -1))).to.deep.equal(v(0, 0));
        expect(subtract(v(1, 1, 'debug'), v(2, 2))).to.deep.equal(v(-1, -1, 'debug'));
        expect(subtract(v(1, 1), v(2, 2, 'debug'))).to.deep.equal(v(-1, -1, 'debug'));
        
        let thunk = () => subtract(v(1, 1, 'debug'), v(2, 2, 'test'));
        expect(thunk).to.throw();
    });
    it('should be able to multiply a vector by a scalar', () => {
        let multiply = Vector2.multiply;
        expect(multiply(v(1, 1), 0)).to.deep.equal(v(0, 0));
        expect(multiply(v(-1, -1), 0)).to.deep.equal(v(-0, -0));
        expect(multiply(v(0, 0), 1)).to.deep.equal(v(0, 0));
        expect(multiply(v(0, 0), -1)).to.deep.equal(v(-0, -0));
        expect(multiply(v(1, 2), 3)).to.deep.equal(v(3, 6));
        expect(multiply(v(1, 2, 'debug'), 3)).to.deep.equal(v(3, 6, 'debug'));
    });
    it('should correctly negate vectors', () => {
        let expected = [
            v(-0, -0), // 0 is not the same as -0 in chai
            v(-1, -1, 'debug'),
            v(1, 2),
            v(-2, 1) // non relevant fields (eg., other) are cleared off
        ];

        let results = testVectors.map(Vector2.negate);
        expect(results).to.deep.equal(expected);
    });
    it('should be able to check for equality between vectors', () => {
        let areEqual = Vector2.areEqual;
        expect(areEqual(testVectors[0], v(0, 0))).to.be.true;
        expect(areEqual(testVectors[0], v(-0, -0))).to.be.true;
        expect(areEqual(testVectors[2], v(-1, -2))).to.be.true;

        expect(areEqual(testVectors[2], v(1, 2))).to.be.false;
        expect(areEqual(testVectors[2], v(-1, -2, 'debug'))).to.be.false;
        expect(areEqual(testVectors[1], v(1, 1))).to.be.false;
        expect(areEqual(testVectors[1], v(1, 1), true)).to.be.true;
        expect(areEqual(testVectors[1], v(1, 1, 'debug'))).to.be.true;
        expect(areEqual(v(1, 1, 'debug'), v(1, 1, 'other'))).to.be.false;
        expect(areEqual(v(1, 1, 'debug'), v(1, 1, 'other'), true)).to.be.true;
    });
    it('should be able to check if two vectors are close enough', () => {
        let closeEnough = Vector2.closeEnough;
        let multiply = Vector2.multiply;
        expect(1 / 3).to.not.equal(0.3333);
        expect(2 * 0.3333).to.not.equal(0.67);
        
        let k = 1 / 3;
        let testA = multiply(v(1, 2), k);
        let expectedA = v(0.33, 0.67);
        let testB = multiply(v(1, 2, 'debug'), k);
        let expectedB = v(0.33, 0.67, 'debug');
        let expectedB2 = v(0.33, 0.67, 'other');
        expect(testA).to.not.deep.equal(expectedA);
        expect(testB).to.not.deep.equal(expectedB);
        expect(closeEnough(0.01)(testA, expectedA)).to.be.true;
        expect(closeEnough(0.01)(testB, expectedB)).to.be.true;
        expect(closeEnough(0.01)(testB, expectedB2)).to.be.false;
        expect(closeEnough(0.01)(testB, expectedB2, true)).to.be.true;
    });
});

