import {readFileSync} from "fs";

type Position = {
    x: number;
    y: number;
    steps: number;
};

type Dimensions = {
    w: number;
    h: number;
};

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export const day21 = (): void => {
    const input = readFileSync("input/day21.txt", "utf-8");

    const grid = input.split("\n")
        .filter(Boolean);

    const startY = grid.findIndex((line) => line.includes("S"));
    const start: Position = {
        x: grid.at(startY)?.indexOf("S") ?? 0,
        y: startY,
        steps: 0,
    };

    firstPart(grid, start);
};

const firstPart = (grid: string[], start: Position): void => {
    const dimensions = getGridDimensions(grid);
    const visitedPositions = new Map<string, number>();
    let activePositions = [start];

    while (activePositions.length) {
        activePositions = activePositions.reduce<Position[]>((previous, position) => {
            [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT].forEach((direction) => {
                const newPosition = move(position, direction);
                if (isWall(grid, newPosition) || isOutbound(newPosition, dimensions) || isVisited(visitedPositions, newPosition)) {
                    return;
                }

                previous.push(newPosition);
                visitedPositions.set(getPositionKey(newPosition), newPosition.steps);
            });

            return previous;
        }, []);
    }

    const reachedGardens = [...visitedPositions].reduce((previous, [, steps]) => previous + Number(steps <= 64 && steps % 2 === 0), 0);

    console.log(reachedGardens);
};

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
    ++newPosition.steps;

    return newPosition;
};

const getGridDimensions = (grid: string[]): Dimensions => ({
    w: grid[0]?.length ?? 0,
    h: grid.length,
});

const isOutbound = ({x, y}: Position, {w, h}: Dimensions): boolean => x < 0 || y < 0 || x >= w || y >= h;

const getTile = (grid: string[], {x, y}: Position): string => grid.at(y)?.at(x) ?? "";

const isWall = (grid: string[], position: Position): boolean => getTile(grid, position) === "#";

const getPositionKey = ({x, y}: Position): string => x + "," + y;

const isVisited = (visitedPositions: Map<string, number>, position: Position): boolean => {
    const key = getPositionKey(position);
    return visitedPositions.has(key) && position.steps >= (visitedPositions.get(key) ?? 0);
};
