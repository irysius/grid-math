export enum Gravity {
    Center  = 0b0000,
    North   = 0b0001,
    South   = 0b0010,
    East    = 0b0100,
    West    = 0b1000,
    NorthEast   = 0b0101,
    NorthWest   = 0b1001,
    SouthEast   = 0b0110,
    SouthWest   = 0b1010
}
export function isGravity(value: Gravity, targetGravity: Gravity): boolean {
    return (value & targetGravity) === targetGravity;
}
export function gravityToString(value: Gravity): string {
    let strings = [
        isGravity(value, Gravity.North) ? 'North' : null,
        isGravity(value, Gravity.South) ? 'South' : null,
        isGravity(value, Gravity.East) ? 'East' : null,
        isGravity(value, Gravity.West) ? 'West' : null
    ].filter(x => x);
    if (strings.length === 0) {
        return 'Gravity.Center';
    } else {
        return `Gravity.${strings.join('')}`;
    }
    
}
export function northOrSouth(gravity: Gravity): Gravity {
    let maskedGravity = 0b0011 & gravity;
    switch (maskedGravity) {
        case Gravity.North:
            return Gravity.North;
        case Gravity.South:
            return Gravity.South;
        case Gravity.Center:
            return Gravity.Center;
        default:
            throw new Error('Cannot be Gravity.North & Gravity.South at the same time.');
    }
}
export function eastOrWest(gravity: Gravity): Gravity {
    let maskedGravity = 0b1100 & gravity;
    switch (maskedGravity) {
        case Gravity.East:
            return Gravity.East;
        case Gravity.West:
            return Gravity.West;
        case Gravity.Center:
            return Gravity.Center;
        default:
            throw new Error('Cannot be Gravity.East & Gravity.West at the same time.');
    }
}

export default Gravity;