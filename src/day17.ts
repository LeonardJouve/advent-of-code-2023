import {readFileSync} from "node:fs";

enum Direction {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
}

type Position = {
    x: number;
    y: number;
    heatLoss: number;
    originDirection?: Direction;
};

type Dimensions = {
    w: number;
    h: number;
};

export const day17 = (): void => {
    console.log("Day17");

    const input = readFileSync("input/day17.txt", "utf-8");

    const lines = input.split("\n").filter(Boolean);

    const dimensions = getDimensions(lines);

    const origin: Position = {
        x: 0,
        y: 0,
        heatLoss: 0,
    };

    const target: Position = {
        x: dimensions.w - 1,
        y: dimensions.h - 1,
        heatLoss: 0,
    };

    firstPart(lines, dimensions, origin, target);
    secondPart(lines, dimensions, origin, target);
};

const firstPart = (lines: string[], dimensions: Dimensions, origin: Position, target: Position): void => {
    const targetHeatLoss = getTargetHeatLoss(lines, dimensions, origin, target, 1, 3);

    console.log(targetHeatLoss);
};

const secondPart = (lines: string[], dimensions: Dimensions, origin: Position, target: Position): void => {
    const targetHeatLoss = getTargetHeatLoss(lines, dimensions, origin, target, 4, 10);

    console.log(targetHeatLoss);
};

const getTargetHeatLoss = (lines: string[], dimensions: Dimensions, origin: Position, target: Position, minMovement: number, maxMovement: number): number => {
    const visitedPositions = new Map<string, number>();
    let activePositions = [origin];
    let targetHeatLoss = Number.MAX_VALUE;
    while (activePositions.length) {
        activePositions = activePositions.reduce<Position[]>((previous, position) => {
            const index = previous.findIndex(({x, y, heatLoss, originDirection}) => x === position.x && y === position.y && heatLoss === position.heatLoss && originDirection === position.originDirection);
            if (index === -1) {
                return previous;
            }

            const key = getPositionKey(position);
            previous.splice(index, 1);

            visitedPositions.set(key, position.heatLoss);


            const directions = Object.values(Direction).filter((direction) => typeof direction === "number" && direction !== position.originDirection && direction !== oppositeDirection(position.originDirection)) as Direction[];
            directions.forEach((direction) => {
                for (let i = minMovement; i <= maxMovement; ++i) {
                    const newPosition = move(lines, position, direction, i);
                    const newPositionKey = getPositionKey(newPosition);
                    const newPositionOppositeKey = getPositionKey({...newPosition, originDirection: oppositeDirection(newPosition.originDirection)});
                    if (newPosition.heatLoss >= targetHeatLoss || isOutbound(newPosition, dimensions) || visitedPositions.has(newPositionKey) && (visitedPositions.get(newPositionKey) ?? 0) <= newPosition.heatLoss || visitedPositions.has(newPositionOppositeKey) && (visitedPositions.get(newPositionOppositeKey) ?? 0) <= newPosition.heatLoss) {
                        continue;
                    }

                    const samePositionIndex = previous.findIndex(({x, y, originDirection}) => x === newPosition.x && y === newPosition.y && (originDirection === newPosition.originDirection || originDirection === oppositeDirection(newPosition.originDirection)));
                    if (samePositionIndex !== -1) {
                        const samePosition = previous[samePositionIndex];
                        if (samePosition && newPosition.heatLoss < samePosition.heatLoss) {
                            previous.splice(samePositionIndex, 1, newPosition);
                        }
                        continue;
                    }

                    previous.push(newPosition);
                }
            });

            if (position.x === target.x && position.y === target.y) {
                targetHeatLoss = Math.min(targetHeatLoss, position.heatLoss);
                return previous.filter(({heatLoss}) => heatLoss < position.heatLoss);
            }

            return previous;
        }, activePositions);
    }

    return targetHeatLoss;
};

const getDimensions = (lines: string[]): Dimensions => ({
    w: lines.at(0)?.length ?? 0,
    h: lines.length,
});

const getHeatLoss = (lines: string[], {x, y}: Position): number => parseInt(lines.at(y)?.at(x) ?? "0");

const isOutbound = ({x, y}: Position, {w, h}: Dimensions): boolean => x < 0 || y < 0 || x >= w || y >= h;

const move = (lines: string[], position: Position, direction: Direction, amount: number): Position => {
    const newPosition: Position = {...position};
    newPosition.originDirection = direction;
    for (let i = 0; i < amount; ++i) {
        switch (direction) {
        case Direction.TOP:
            --newPosition.y;
            break;
        case Direction.BOTTOM:
            ++newPosition.y;
            break;
        case Direction.LEFT:
            --newPosition.x;
            break;
        case Direction.RIGHT:
            ++newPosition.x;
        }
        newPosition.heatLoss += getHeatLoss(lines, newPosition);
    }

    return newPosition;
};

const getPositionKey = ({x, y, originDirection}: Position): string => x + ":" + y + `${originDirection !== undefined ? ":" + originDirection : ""}`;

const oppositeDirection = (direction?: Direction): Direction|undefined => {
    switch (direction) {
    case Direction.TOP:
        return Direction.BOTTOM;
    case Direction.BOTTOM:
        return Direction.TOP;
    case Direction.LEFT:
        return Direction.RIGHT;
    case Direction.RIGHT:
        return Direction.LEFT;
    default:
        return undefined;
    }
};
