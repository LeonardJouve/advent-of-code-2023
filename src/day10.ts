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
    secondPart(area, start);
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
};

const secondPart = (area: string[], start: Position): void => {
    const [startNeighbor] = getStartNeighbors(area, start);

    if (!startNeighbor) {
        return;
    }

    // TODO: missing first leftHandNeighbor
    let position = startNeighbor;
    let lastPosition = start;
    const path = new Set<string>(getPositionKey(position));
    const leftHandNeighbors = new Set<string>();

    do {
        const [newPosition] = getNeighbors(area, position).filter(({x, y}) => x !== lastPosition.x || y !== lastPosition.y);
        if (!newPosition) {
            return;
        }

        const [neighborsDirection] = (getNeighborsDirection(getPipe(area, newPosition)) ?? []).filter((direction) => {
            const neighborPosition = getPositionInDirection(getAreaDimension(area), newPosition, direction);

            if (!neighborPosition) {
                return false;
            }

            return neighborPosition.x !== position.x || neighborPosition.y !== position.y;
        });

        if (newPosition.x === start.x && newPosition.y === start.y) {
            break;
        }

        if (neighborsDirection === undefined) {
            return;
        }

        const leftHandNeighbor = getLeftHandNeighbor(area, newPosition, neighborsDirection);

        if (leftHandNeighbor) {
            leftHandNeighbors.add(getPositionKey(leftHandNeighbor));
        }

        lastPosition = position;
        position = newPosition;
        path.add(getPositionKey(position));
    } while (position.x !== start.x || position.y !== start.y);

    leftHandNeighbors.forEach((leftHandNeighbor) => {
        if (!path.has(leftHandNeighbor)) {
            return;
        }
        leftHandNeighbors.delete(leftHandNeighbor);
    });

    [...leftHandNeighbors].forEach((leftHandNeighbor) => {
        getNeighborsNotInPath(area, path, getKeyPosition(leftHandNeighbor), leftHandNeighbors);
    });

    const enclosedPositions = [...leftHandNeighbors].map((leftHandNeighborKey) => getKeyPosition(leftHandNeighborKey));
    // .filter((leftHandNeighbor) => getPipe(area, leftHandNeighbor) === ".");

    // const totalLength = (area[0]?.length ?? 0) * area.length;

    console.log(enclosedPositions.length);
};

const getPipe = (area: string[], {x, y}: Position): string => area.at(y)?.at(x) ?? "";

const getNeighborsDirection = (pipe: string): Direction[] | undefined => ({
    "|": [Direction.TOP, Direction.BOTTOM],
    "-": [Direction.LEFT, Direction.RIGHT],
    "L": [Direction.TOP, Direction.RIGHT],
    "J": [Direction.LEFT, Direction.TOP],
    "7": [Direction.LEFT, Direction.BOTTOM],
    "F": [Direction.BOTTOM, Direction.RIGHT],
}[pipe]);

const getNeighbors = (area: string[], position: Position): Position[] => {
    const neighborsDirection = getNeighborsDirection(getPipe(area, position));

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

const getLeftHandNeighbor = (area: string[], position: Position, direction: Direction): Position | null => {
    let leftDirection: Direction;
    switch (direction) {
    case Direction.TOP:
        leftDirection = Direction.LEFT;
        break;
    case Direction.BOTTOM:
        leftDirection = Direction.RIGHT;
        break;
    case Direction.LEFT:
        leftDirection = Direction.BOTTOM;
        break;
    case Direction.RIGHT:
        leftDirection = Direction.TOP;
        break;
    default:
        leftDirection = direction;
    }

    return getPositionInDirection(getAreaDimension(area), position, leftDirection);
};

const getPositionKey = (position: Position): string => String(position.x) + "," + String(position.y);

const getKeyPosition = (key: string): Position => {
    const [x, y] = key.split(",").map((value) => parseInt(value));

    return {
        x: x ?? 0,
        y: y ?? 0,
    };
};

const getNeighborsNotInPath = (area: string[], path: Set<string>, position: Position, neighbors: Set<string>): void => {
    [Direction.TOP, Direction.BOTTOM, Direction.LEFT, Direction.RIGHT].forEach((direction) => {
        const neighbor = getPositionInDirection(getAreaDimension(area), position, direction);

        if (!neighbor) {
            return;
        }

        const neighborKey = getPositionKey(neighbor);

        if (path.has(neighborKey) || neighbors.has(neighborKey)) {
            return;
        }

        neighbors.add(neighborKey);

        getNeighborsNotInPath(area, path, neighbor, neighbors);
    });
};
