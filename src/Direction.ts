export enum Direction {
    None  = 0b0000,
    North   = 0b0001,
    South   = 0b0010,
    East    = 0b0100,
    West    = 0b1000,
    NorthEast   = 0b0101,
    NorthWest   = 0b1001,
    SouthEast   = 0b0110,
    SouthWest   = 0b1010
}
export function isDirection(value: Direction, targetDirection: Direction): boolean {
    return (value & targetDirection) === targetDirection;
}
export function directionToString(value: Direction): string {
    let strings = [
        isDirection(value, Direction.North) ? 'North' : null,
        isDirection(value, Direction.South) ? 'South' : null,
        isDirection(value, Direction.East) ? 'East' : null,
        isDirection(value, Direction.West) ? 'West' : null
    ].filter(x => x);
    if (strings.length === 0) {
        return 'Direction.None';
    } else {
        return `Direction.${strings.join('')}`;
    }
}

export default Direction;