import { expect } from 'chai';
import { Size } from '@irysius/grid-math';

describe('Size', () => {
    it('should be able to create sizes', () => {
        let create = Size.create
        expect(create(10, 10)).to.deep.equal({ width: 10, height: 10 });
        expect(create(-10, -10)).to.deep.equal({ width: -10, height: -10 });
    });
    it('should be able to validate if something is a size', () => {
        let isSize = Size.isSize;
        let composite = {};
        Object.defineProperty(composite, 'width', {
            get: () => 10
        });
        Object.defineProperty(composite, 'height', {
            get: () => 10
        });
        let sizes = [
            { width: 0, height: 0 }, { width: 10, height: 10 }, 
            { width: -10, height: -10 }, // oddly enough, considering allowing negative widths/heights
            {}, { width: 10 }, { height: 10 }, { width: '10', height: '10' }, { width: 10, height: 10, foo: 'bar' },
            { x: 0, y: 0, width: 10, height: 0 }, composite, null
        ];
        let expected = [
            true, true, 
            true,
            false, false, false, false, true,
            true, true, false
        ];

        let results = sizes.map(isSize);
        expect(results).to.deep.equal(expected);
    });
});