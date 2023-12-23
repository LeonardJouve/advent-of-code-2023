import {readFileSync} from "fs";

type Position = {
    x: number;
    y: number;
};

type Dimensions = {
    w: number;
    h: number;
};

type Hike = {
    position: Position;
    length: number;
    visitedPositions: Set<string>;
};

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export const day23 = (): void => {
    console.log("Day23");

    const input = readFileSync("input/day23.txt", "utf-8");

    const start: Position = {
        x: input.indexOf("."),
        y: 0,
    };

    const grid = input.split("\n")
        .filter(Boolean);

    const end: Position = {
        x: grid[grid.length - 1]?.lastIndexOf(".") ?? 0,
        y: grid.length - 1,
    };

    const dimensions = getDimensions(grid);

    firstPart(grid, start, end, dimensions);
    secondPart(grid, start, end, dimensions);
};

const firstPart = (grid: string[], start: Position, end: Position, dimensions: Dimensions): void => {
    const longestHike = getLongestHike(grid, start, end, dimensions, true);

    console.log(longestHike);
};

const secondPart = (grid: string[], start: Position, end: Position, dimensions: Dimensions): void => {
    const longestHike = getLongestHike(grid, start, end, dimensions, false);

    console.log(longestHike);
};

const getLongestHike = (grid: string[], start: Position, end: Position, dimensions: Dimensions, includeSlopes: boolean): number => {
    const endKey = getPositionKey(end);

    let hikes: Hike[] = [{
        position: start,
        length: 0,
        visitedPositions: new Set(getPositionKey(start)),
    }];

    let longestHike = 0;
    while (hikes.length) {
        hikes = hikes.reduce<Hike[]>((previous, {position, length, visitedPositions}) => {
            if (getPositionKey(position) === endKey) {
                longestHike = Math.max(length, longestHike);
                return previous;
            }

            getNeighbors(grid, visitedPositions, position, dimensions, includeSlopes).forEach((neighbor) => {
                const newVisitedPositions = new Set(visitedPositions);
                newVisitedPositions.add(getPositionKey(neighbor));
                previous.push({
                    position: neighbor,
                    length: length + 1,
                    visitedPositions: newVisitedPositions,
                });
            });

            return previous;
        }, []);
    }

    return longestHike;
};

const getDimensions = (grid: string[]): Dimensions => ({
    w: grid[0]?.length ?? 0,
    h: grid.length,
});

const getTile = (grid: string[], {x, y}: Position): string => grid.at(y)?.at(x) ?? "";

const isForest = (grid: string[], position: Position): boolean => getTile(grid, position) === "#";

const getNeighbors = (grid: string[], visitedPositions: Set<string>, position: Position, dimensions: Dimensions, includeSlopes: boolean): Position[] => [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT].filter((direction) => {
    if (!includeSlopes) {
        return true;
    }

    const tile = getTile(grid, position);

    switch (tile) {
    case "<":
        return direction === Direction.LEFT;
    case ">":
        return direction === Direction.RIGHT;
    case "v":
        return direction === Direction.DOWN;
    case "^":
        return direction === Direction.UP;
    default:
        return true;
    }
}).reduce<Position[]>((previous, direction) => {
    const newPosition = move(position, direction);
    if (isOutbound(newPosition, dimensions) || isForest(grid, position) || visitedPositions.has(getPositionKey(newPosition))) {
        return previous;
    }

    previous.push(newPosition);

    return previous;
}, []);

const isOutbound = ({x, y}: Position, {w, h}: Dimensions): boolean => x < 0 || y < 0 || x >= w || y >= h;

const move = (position: Position, direction: Direction): Position => {
    const newPosition = {...position};

    switch (direction) {
    case Direction.UP:
        --newPosition.y;
        break;
    case Direction.DOWN:
        ++newPosition.y;
        break;
    case Direction.LEFT:
        --newPosition.x;
        break;
    case Direction.RIGHT:
        ++newPosition.x;
        break;
    }

    return newPosition;
};

const getPositionKey = ({x, y}: Position): string => x + "," + y;
