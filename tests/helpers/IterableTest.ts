import { expect } from 'chai';
import * as math from '@irysius/grid-math';
let {
    isIterator, fromArray,
    map, filter, flatten, zip, flow,
    skip, take, skipTake
} = math.helpers.Iterable;

function* empty() {

}
function* numbers(): IterableIterator<number> {
    yield 1; yield 2; yield 3;
    yield 4; yield 5; yield 6;
    yield 7; yield 8; yield 9;
}
function* letters(): IterableIterator<string> {
    yield 'A'; yield 'B'; yield 'C';
    yield 'D'; yield 'E'; yield 'F';
}

describe('Iterable', () => {
    context('SlidingWindow', () => {
        // TODO
    });
    it("should be able to determine what's an iterator", () => {
        // the only thing we check for is next()
        let tests = [
            { next: function () {} },
            {}, null, function x() {},
            function* y() {},
            (function* z() {})()
        ];
        let expected = [
            true,
            false, false, false,
            false,
            true
        ];
        let results = tests.map(isIterator);
        expect(results).to.deep.equal(expected);
    });

    it('should be able to take elements from an iterator', () => {
        expect(take(1)(empty())).to.deep.equal([]);

        expect(take(1)(numbers())).to.deep.equal([1]);
        let expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        expect(take(9)(numbers())).to.deep.equal(expected);
        expect(take(12)(numbers())).to.deep.equal(expected);
    });
    it('should be able to skip elements from an iterator', () => {
        let first = numbers();
        skip(0)(first);
        expect(take(1)(first)).to.deep.equal([1]);

        let second = numbers();
        skip(3)(second);
        expect(take(1)(second)).to.deep.equal([4]);

        let third = numbers();
        skip(2)(third);
        skip(3)(third);
        expect(take(1)(third)).to.deep.equal([6]);

        let fourth = numbers();
        skip(9)(fourth);
        expect(take(1)(fourth)).to.deep.equal([]);
    });
    it('should be able to skip and take elements from an iterator', () => {
        let expected = [3, 4, 5, 6];
        expect(skipTake(2, 4)(numbers())).to.deep.equal(expected);
    });

    it('should be able to turn an array into an iterator', () => {
        let l = fromArray(['Alpha', 'Bravo', 'Charlie', 'Delta']);
        expect(l.next().value).to.equal('Alpha');
        expect(l.next().value).to.equal('Bravo');

    });

    it('should have the ability to map iterators', () => {
        let double = x => x * 2;
        let doubledNumbers = map(double)(numbers());
        let expected = [2, 4, 6, 8, 10, 12, 14, 16, 18];
        expect(take(9)(doubledNumbers)).to.deep.equal(expected);
    });
    it('should have the ability to filter iterators', () => {
        let f = x => x % 3 === 0;
        let divisibleByThree = filter(f)(numbers());
        let expected = [3, 6, 9];
        expect(take(9)(divisibleByThree)).to.deep.equal(expected);
    });
    it('should have the ability to flatten a nested iterator (one level)', () => {
        function* nested(): IterableIterator<number|IterableIterator<number>> {
            yield -3; yield -2; yield -1;
            yield 0;
            yield numbers();
            yield 10; yield 11; yield 12;
        }
        let expected1 = [
            -3, -2, -1, 0,
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            10, 11, 12
        ];
        expect(take(20)(flatten()(nested()))).to.deep.equal(expected1);

        let results = take(20)(nested());
        expect(results).to.have.lengthOf(8);
        expect(isIterator(results[4])).to.be.true;
    });
    it('should provide the ability to zip two iterators', () => {
        let zipped = zip(letters(), numbers());
        let expected = [
            ['A', 1], ['B', 2], ['C', 3],
            ['D', 4], ['E', 5], ['F', 6],
            [undefined, 7], [undefined, 8], [undefined, 9]
        ];
        expect(take(10)(zipped)).to.deep.equal(expected);
    });
    it('should provide the ability to pipe iterator transformations', () => {
        let even = (x: number) => x % 2 === 0;
        let halve = (x: number) => x / 2;
        let expected = [1, 2, 3, 4];
        let pipe = flow<number, number>(
            filter(even), 
            map(halve));
        expect(take(10)(pipe(numbers()))).to.deep.equal(expected);
    });
});