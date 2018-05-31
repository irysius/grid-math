import { expect } from 'chai';
import { Rect } from '@irysius/grid-math';
let r = Rect.create;

describe('Rect', () => {
    it('should be able to create rects', () => {
        expect(Rect.create(1, 1, 5, 5)).to.deep.equal({ x: 1, y: 1, width: 5, height: 5 });
        expect(Rect.create(1, 1, 5, 5, 'debug')).to.deep.equal({ x: 1, y: 1, width: 5, height: 5, type: 'debug' });
    });
    it('should correctly generate empty rects', () => {
        expect(Rect.empty()).to.deep.equal({ x: 0, y: 0, width: 0, height: 0 });
        expect(Rect.empty('debug')).to.deep.equal({ x: 0, y: 0, width: 0, height: 0, type: 'debug' });
    });
    it('should be able to validate if something is a rect', () => {
        let isRect = Rect.isRect;
        let composite = {};
        Object.defineProperty(composite, 'x', { get: () => 1 });
        Object.defineProperty(composite, 'y', { get: () => 1 });
        Object.defineProperty(composite, 'width', { get: () => 5 });
        Object.defineProperty(composite, 'height', { get: () => 5 });
        let rects = [
            { x: 1, y: 1, width: 5, height: 5 },
            {}, { x: '1', y: '1', width: '5', height: '5' },
            { y: 1, width: 5, height: 5 }, { x: 1, width: 5, height: 5 }, { x: 1, y: 1, height: 5 }, { x: 1, y: 1, width: 5 },
            { x: 1, y: 1, width: 5, height: 5, sample: 'test' }, { x: 1, y: 1, width: 5, height: 5, type: 'debug' }, { x: 1, y: 1, width: 5, height: 5, type: 0 },
            composite, null
        ];
        let expected = [
            true,
            false, false,
            false, false, false, false,
            true, true, false,
            true, false
        ];

        let results = rects.map(isRect);
        expect(results).to.deep.equal(expected);

        let typedRects = [
            r(1, 1, 5, 5), r(1, 1, 5, 5, 'debug'), r(1, 1, 5, 5, 'test')
        ];
        let typedExpecations = [
            false, true, false
        ];
        let typedResults = typedRects.map(x => isRect(x, 'debug'));
        expect(typedResults).to.deep.equal(typedExpecations);
    });
    it('should be able to check for equality between rects', () => {
        let areEqual = Rect.areEqual;
        expect(areEqual(r(0, 0, 0, 0), r(0, 0, 0, 0))).to.be.true;
        expect(areEqual(r(0, 0, 0, 0), r(-0, -0, -0, -0))).to.be.true;
        
        expect(areEqual(r(0, 0, 0, 0), r(0, 0, 0, 0, 'debug'))).to.be.false;
        expect(areEqual(r(0, 0, 0, 0), r(0, 0, 0, 0, 'debug'), true)).to.be.true;
        expect(areEqual(r(0, 0, 0, 0, 'debug'), r(0, 0, 0, 0, 'debug'))).to.be.true;
        expect(areEqual(r(0, 0, 0, 0, 'other'), r(0, 0, 0, 0, 'debug'))).to.be.false;
        expect(areEqual(r(0, 0, 0, 0, 'other'), r(0, 0, 0, 0, 'debug'), true)).to.be.true;
    });
    it('should be able to check if two rects are close enough', () => {
        let areEqual = Rect.areEqual;
        let closeEnough = Rect.closeEnough;
        let x = r(1, 1, 50, 50);
        let y = r(1, 1, 50, 50, 'debug');
        let z = r(1.01, 0.99, 50.1, 49.9, 'debug');
        let w = r(1.01, 0.99, 50.1, 49.9, 'other');

        expect(areEqual(y, z)).to.be.false;
        expect(closeEnough(0.1)(y, z)).to.be.false; // wow, 0.1 isn't close enough...
        expect(closeEnough(0.11)(y, z)).to.be.true;
        expect(closeEnough(0.01)(y, z)).to.be.false;
        expect(closeEnough(0.11)(y, w)).to.be.false;
        expect(closeEnough(0.11)(y, w, true)).to.be.true;
    });
});
