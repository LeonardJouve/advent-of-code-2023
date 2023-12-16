import {readFileSync} from "node:fs";

enum Direction {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
}

type Location = {
    x: number;
    y: number;
    direction: Direction;
};

type Dimensions = {
    w: number;
    h: number;
};

export const day16 = (): void => {
    console.log("Day16");

    const input = readFileSync("input/day16.txt", "utf-8");

    const lines = input.split("\n").filter(Boolean);
    const dimensions = getDimensions(lines);

    firstPart(lines, dimensions);
    secondPart(lines, dimensions);
};

const firstPart = (lines: string[], dimensions: Dimensions): void => {
    const visitedTilesAmount = getVisitedTilesAmount(lines, dimensions, {
        x: -1,
        y: 0,
        direction: Direction.RIGHT,
    });

    console.log(visitedTilesAmount);
};

const secondPart = (lines: string[], dimensions: Dimensions): void => {
    const initialLocations: Location[] = [];
    for (let i = 0; i < dimensions.w; ++i) {
        initialLocations.push({
            x: i,
            y: -1,
            direction: Direction.BOTTOM,
        });
        initialLocations.push({
            x: i,
            y: dimensions.h,
            direction: Direction.TOP,
        });
    }

    for (let i = 0; i < dimensions.h; ++i) {
        initialLocations.push({
            x: -1,
            y: i,
            direction: Direction.RIGHT,
        });
        initialLocations.push({
            x: dimensions.w,
            y: i,
            direction: Direction.LEFT,
        });
    }

    const maxVisitedTilesAmount = initialLocations.reduce((previous, location) => Math.max(previous, getVisitedTilesAmount(lines, dimensions, location)), 0);

    console.log(maxVisitedTilesAmount);
};

const getVisitedTilesAmount = (lines: string[], dimensions: Dimensions, initialLocation: Location): number => {
    const visitedLocations = new Set<string>();
    let activeLocations: Location[] = [initialLocation];
    while (activeLocations.length) {
        activeLocations = activeLocations.reduce<Location[]>((previous, location) => {
            const index = previous.findIndex(({x, y, direction}) => x === location.x && y === location.y && direction === location.direction);
            move(location);

            const key = getLocationKey(location);

            if (index === -1) {
                return previous;
            }

            previous.splice(index, 1);
            if (isOutbound(location, dimensions) || visitedLocations.has(key)) {
                return previous;
            }

            visitedLocations.add(key);

            getNextDirections(lines, location).forEach((nextDirection) => previous.push({
                ...location,
                direction: nextDirection,
            }));

            return previous;
        }, activeLocations);
    }

    return [...visitedLocations].map(getKeyLocation)
        .filter((location, i, self) => self.findIndex(({x, y}) => x === location.x && y === location.y) === i).length;
};

const move = (location: Location): void => {
    switch (location.direction) {
    case Direction.TOP:
        --location.y;
        break;
    case Direction.BOTTOM:
        ++location.y;
        break;
    case Direction.LEFT:
        --location.x;
        break;
    case Direction.RIGHT:
        ++location.x;
    }
};

const isOutbound = ({x, y}: Location, {w, h}: Dimensions): boolean => x < 0 || y < 0 || x >= w || y >= h;

const getTile = (lines: string[], {x, y}: Location): string|undefined => lines.at(y)?.at(x);

const getDimensions = (lines: string[]): Dimensions => ({
    w: lines[0]?.length ?? 0,
    h: lines.length,
});

const getNextDirections = (lines: string[], location: Location): Direction[] => {
    const {direction} = location;
    switch (getTile(lines, location)) {
    case "-":
        if (direction === Direction.LEFT || direction === Direction.RIGHT) {
            break;
        }
        return [Direction.LEFT, Direction.RIGHT];
    case "|":
        if (direction === Direction.TOP || direction === Direction.BOTTOM) {
            break;
        }
        return [Direction.TOP, Direction.BOTTOM];
    case "/":
        switch (direction) {
        case Direction.TOP:
            return [Direction.RIGHT];
        case Direction.BOTTOM:
            return [Direction.LEFT];
        case Direction.LEFT:
            return [Direction.BOTTOM];
        case Direction.RIGHT:
            return [Direction.TOP];
        }
    case "\\": // eslint-disable-line no-fallthrough
        switch (direction) {
        case Direction.TOP:
            return [Direction.LEFT];
        case Direction.BOTTOM:
            return [Direction.RIGHT];
        case Direction.LEFT:
            return [Direction.TOP];
        case Direction.RIGHT:
            return [Direction.BOTTOM];
        }
    }
    return [direction];
};

const getLocationKey = ({x, y, direction}: Location): string => x + ":" + y + ":" + direction;

const getKeyLocation = (key: string): Location => {
    const [x, y, direction] = key.split(":").map((value) => parseInt(value));

    return {
        x: x ?? 0,
        y: y ?? 0,
        direction: direction as Direction,
    };
};
