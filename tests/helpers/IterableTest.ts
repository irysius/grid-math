import { expect } from 'chai';
import { ISlidingWindow, SlidingWindow, map, take, isIterator, skip, skipTake, fromArray, filter, flatten, zip, flow } from '@irysius/grid-math/helpers/Iterable';

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

describe('helpers/Iterable', () => {
    context('SlidingWindow', () => {
        function windowedValues<T>(value: T, sw: ISlidingWindow<T>) {
            return {
                prev: sw.prevValues,
                curr: value,
                next: sw.nextValues
            };
        }
        it('should throw if the capacities are less than 0', () => {
            let thunks = [
                () => SlidingWindow(letters(), { prevCapacity: 0, nextCapacity: -1 }),
                () => SlidingWindow(letters(), { prevCapacity: -1, nextCapacity: 0 }),
                () => SlidingWindow(letters(), { prevCapacity: -1, nextCapacity: -1 }),
            ];

            thunks.forEach(thunk => {
                expect(thunk).to.throw();
            });
        });
        it('should be able to act like as a normal iterator if prev and next are set to 0', () => {
            let sw = SlidingWindow(letters(), { prevCapacity: 0, nextCapacity: 0 });
            let mappedSw = map(windowedValues)(sw);
            let expected = [
                { prev: [], curr: 'A', next: [] },
                { prev: [], curr: 'B', next: [] },
                { prev: [], curr: 'C', next: [] },
                { prev: [], curr: 'D', next: [] },
                { prev: [], curr: 'E', next: [] },
                { prev: [], curr: 'F', next: [] }
            ];
            expect(take(10)(mappedSw)).to.deep.equal(expected);
        });
        it('should be able to return future values using nextCapacity', () => {
            let sw = SlidingWindow(letters(), { prevCapacity: 0, nextCapacity: 3 });
            let mappedSw = map(windowedValues)(sw);
            let expected = [
                { prev: [], curr: 'A', next: ['B', 'C', 'D'] },
                { prev: [], curr: 'B', next: ['C', 'D', 'E'] },
                { prev: [], curr: 'C', next: ['D', 'E', 'F'] },
                { prev: [], curr: 'D', next: ['E', 'F'] },
                { prev: [], curr: 'E', next: ['F'] },
                { prev: [], curr: 'F', next: [] }
            ];
            expect(take(10)(mappedSw)).to.deep.equal(expected);
        });
        it('should be able to retain past values using prevCapacity', () => {
            let sw = SlidingWindow(letters(), { prevCapacity: 3, nextCapacity: 0 });
            let mappedSw = map(windowedValues)(sw);
            let expected = [
                { prev: [], curr: 'A', next: [] },
                { prev: ['A'], curr: 'B', next: [] },
                { prev: ['A', 'B'], curr: 'C', next: [] },
                { prev: ['A', 'B', 'C'], curr: 'D', next: [] },
                { prev: ['B', 'C', 'D'], curr: 'E', next: [] },
                { prev: ['C', 'D', 'E'], curr: 'F', next: [] }
            ];
            expect(take(10)(mappedSw)).to.deep.equal(expected);
        });
        it('should be able to retain the past and see the future using both capacities', () => {
            let sw = SlidingWindow(letters(), { prevCapacity: 2, nextCapacity: 2 });
            let mappedSw = map(windowedValues)(sw);
            let expected = [
                { prev: [], curr: 'A', next: ['B', 'C'] },
                { prev: ['A'], curr: 'B', next: ['C', 'D'] },
                { prev: ['A', 'B'], curr: 'C', next: ['D', 'E'] },
                { prev: ['B', 'C'], curr: 'D', next: ['E', 'F'] },
                { prev: ['C', 'D'], curr: 'E', next: ['F'] },
                { prev: ['D', 'E'], curr: 'F', next: [] }
            ];
            expect(take(10)(mappedSw)).to.deep.equal(expected);
        });
        
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