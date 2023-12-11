import {readFileSync} from "fs";

type Position = {
    x: number;
    y: number;
};

type Dimension = {
    w: number;
    h: number;
};

enum Direction {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
}

export const day10 = (): void => {
    console.log("Day10");

    const input = readFileSync("input/day10.txt", "utf-8");

    const area = input.split("\n")
        .filter(Boolean);

    const start = area.reduce<Position>((previous, line, i) => !line.includes("S") ? previous : {
        x: line.indexOf("S"),
        y: i,
    }, {
        x: 0,
        y: 0,
    });

    firstPart(area, start);
};

const firstPart = (area: string[], start: Position): void => {
    const [startNeighbor] = getStartNeighbors(area, start);

    if (!startNeighbor) {
        return;
    }

    let position = startNeighbor;
    let lastPosition = start;
    let i = 1;


    do {
        const [newPosition] = getNeighbors(area, position).filter(({x, y}) => x !== lastPosition.x || y !== lastPosition.y);

        if (!newPosition) {
            return;
        }

        lastPosition = position;
        position = newPosition;
        ++i;
    } while (position.x !== start.x || position.y !== start.y);

    --i;
    console.log(Math.ceil(i / 2));
    // area;
};

const getPipe = (area: string[], {x, y}: Position): string => area.at(y)?.at(x) ?? "";

const getNeighbors = (area: string[], position: Position): Position[] => {
    const neighborsDirection = {
        "|": [Direction.TOP, Direction.BOTTOM],
        "-": [Direction.LEFT, Direction.RIGHT],
        "L": [Direction.TOP, Direction.RIGHT],
        "J": [Direction.LEFT, Direction.TOP],
        "7": [Direction.LEFT, Direction.BOTTOM],
        "F": [Direction.BOTTOM, Direction.RIGHT],
    }[getPipe(area, position)];

    if (!neighborsDirection) {
        return [];
    }

    return neighborsDirection.map((neighborDirection) => getPositionInDirection(getAreaDimension(area), position, neighborDirection))
        .filter(Boolean) as Position[];
};

const getPositionInDirection = ({w, h}: Dimension, {x, y}: Position, direction: Direction): Position | null => {
    switch (direction) {
    case Direction.TOP:
        return y <= 0 ? null : {
            x,
            y: y - 1,
        };
    case Direction.BOTTOM:
        return y >= h - 1 ? null : {
            x,
            y: y + 1,
        };
    case Direction.LEFT:
        return x <= 0 ? null : {
            x: x - 1,
            y,
        };
    case Direction.RIGHT:
        return x >= w - 1 ? null : {
            x: x + 1,
            y,
        };
    default:
        return null;
    }
};

const getAreaDimension = (area: string[]): Dimension => ({
    w: (area.at(0) ?? "").length,
    h: area.length,
});

const getStartNeighbors = (area: string[], start: Position): Position[] => {
    const areaDimension = getAreaDimension(area);
    return [Direction.TOP, Direction.BOTTOM, Direction.LEFT, Direction.RIGHT].map((direction) => getPositionInDirection(areaDimension, start, direction))
        .filter((position) => position && getNeighbors(area, position).find(({x, y}) => x === start.x && y === start.y)) as Position[];
};
