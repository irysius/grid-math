// This should be an entirely separate repo...

export interface ISlidingWindowOptions {
    prevCapacity: number;
    nextCapacity: number;
}
export interface ISlidingWindow<T> {
    next(): { value: T, done: boolean };
    readonly prevValues: T[];
    readonly currValue: T;
    readonly nextValues: T[];
    readonly done: boolean;
}
export function SlidingWindow<T>(collection: IterableIterator<T>, options: ISlidingWindowOptions): ISlidingWindow<T> {
    let {
        prevCapacity, nextCapacity
    } = options;
    let prevValues: T[] = [];
    let currValue: T = null;
    let nextValues: T[] = [];
    let started = false;
    let done = false;

    function initialNext() {
        started = true;
        let curr = collection.next();
        if (curr.done) { 
            // empty collection
            done = true;
            return true;
        }

        currValue = curr.value;
        
        // repeat for nextCapacity count
        let i, next;
        for (i = 0; i < nextCapacity; ++i) {
            next = collection.next();
            if (!next.done) { nextValues.push(next.value); }
        }
        return false;
    }
    function innerNext() {
        prevValues.push(currValue);
        // expel if prevValues array is too long
        if (prevValues.length > prevCapacity) { prevValues.splice(0, 1); }

        let _next = nextValues.splice(0, 1);
        if (_next.length === 1) {
            currValue = _next[0];
        } else {
            currValue = undefined;
            done = true;
            return true;
        }
        
        let next = collection.next();
        // if there are no more values
        if (!next.done) { nextValues.push(next.value); }
        return false;
    }
    function next(): { value: T, done: boolean } {
        if (done) { 
            return {
                value: undefined,
                done: true
            }; 
        }
        if (!started) {
            let _done = initialNext()
            return {
                value: currValue,
                done: _done
            };
        } else {
            let _done = innerNext();
            return {
                value: currValue,
                done: _done
            };
        }
    }
    
    let proxy = { next };
    Object.defineProperty(proxy, 'currValue', {
        get: () => currValue, enumerable: true
    });
    Object.defineProperty(proxy, 'prevValues', {
        get: () => prevValues, enumerable: true
    });
    Object.defineProperty(proxy, 'nextValues', {
        get: () => nextValues, enumerable: true
    });
    Object.defineProperty(proxy, 'done', {
        get: () => done, enumerable: true
    });

    return proxy as any;
}

export function isIterator<T = any>(value): value is IterableIterator<T> {
    return !!(value && typeof value.next === 'function');
}

// Turn the function into functional friendly form.
export function map<T, U>(mapper: (x: T) => U) {
    return function (collection: IterableIterator<T>): IterableIterator<U> {
        let mapped = function* () {
            let { value, done } = collection.next();
    
            while (!done) {
                yield mapper(value);
                let next = collection.next();
                value = next.value;
                done = next.done;
            }
        };
        return mapped();
    };
}
export function flatten() {
    return function <T>(collection: IterableIterator<T|IterableIterator<T>>): IterableIterator<T> {
        let flattened = function* () {
            let { value, done } = collection.next();

            while (!done) {
                if (isIterator(value)) {
                    yield* value;
                } else {
                    yield value;
                }
                let next = collection.next();
                value = next.value;
                done = next.done;
            }
        };
        return flattened();
    };
}
export function filter<T>(filterer: (x: T) => boolean) {
    return function (collection: IterableIterator<T>): IterableIterator<T> {
        let filtered = function* () {
            let { value, done } = collection.next();

            while (!done) {
                if (filterer(value)) {
                    yield value;
                }
                let next = collection.next();
                value = next.value;
                done = next.done;
            }
        };
        return filtered();
    };
}
export function zip<A, B>(collectionA: IterableIterator<A>, collectionB: IterableIterator<B>): IterableIterator<[A, B]> {
    let zipped = function* () {
        let { value: valueA, done: doneA } = collectionA.next();
        let { value: valueB, done: doneB } = collectionB.next();

        while (!doneA || !doneB) {
            yield [valueA, valueB] as [A, B];
            let nextA = collectionA.next();
            let nextB = collectionB.next();
            valueA = nextA.value; doneA = nextA.done;
            valueB = nextB.value; doneB = nextB.done;
        }
    };
    return zipped();
}
export type IteratorPipe = (x: IterableIterator<any>) => IterableIterator<any>;
export function flow<A = any, Z = any>(...pipes: IteratorPipe[]) {
    return function (collection: IterableIterator<A>): IterableIterator<Z> {
        let _collection: IterableIterator<any> = collection;
        pipes.forEach(p => {
            _collection = p(_collection);
        });
        return _collection;
    };
}

export function skip(count: number) {
    return function <T>(collection: IterableIterator<T>): void {
        let i;
        for (i = 0; i < count; ++i) {
            collection.next();
        }
    };
}
export function take(count: number) {
    return function <T>(collection: IterableIterator<T>): T[] {
        let i, results: T[] = [];
        for (i = 0; i < count; ++i) {
            let { value, done } = collection.next();
            if (!done) { results.push(value); }
        }
        return results;
    };
}
export function skipTake(_skip: number, _take: number) {
    return function <T>(collection: IterableIterator<T>): T[] {
        skip(_skip)(collection);
        return take(_take)(collection);
    }
}

export function fromArray<T>(items: T[]): IterableIterator<T> {
    let inner = function* () {
        let i;
        for (i = 0; i < items.length; ++i) {
            yield items[i];
        }
    };
    return inner();
}

