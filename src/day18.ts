import {readFileSync} from "fs";

enum Direction {
    UP = "U",
    DOWN = "D",
    RIGHT = "R",
    LEFT = "L",
}

type Instruction = {
    direction: Direction;
    amount: number;
    color: string;
};

type Position = {
    x: number;
    y: number;
};

// type PositionIntervals = {
//     minX: number;
//     maxX: number;
//     minY: number;
//     maxY: number;
// };

export const day18 = (): void => {
    const input = readFileSync("input/day18.txt", "utf-8");

    const instructions = input.split("\n")
        .filter(Boolean)
        .map<Instruction>((line) => {
            const [direction, amount, color] = line.split(" ");

            return {
                direction: direction as Direction,
                amount: parseInt(amount ?? "0"),
                color: color?.substring(color.indexOf("#") + 1, color.indexOf(")")) ?? "",
            };
        });

    firstPart(instructions);
    secondPart(instructions);
};

const firstPart = (instructions: Instruction[]): void => {
    const insidePointsAmount = getInsidePointsAmount(instructions);

    console.log(insidePointsAmount);
};

const secondPart = (instructions: Instruction[]): void => {
    const correctedInstructions = correctInstructions(instructions);

    const insidePointsAmount = getInsidePointsAmount(correctedInstructions);

    console.log(insidePointsAmount);
};

const getInsidePointsAmount = (instructions: Instruction[]): number => {
    const currentPosition = {
        x: 0,
        y: 0,
    };
    const points = instructions.map(({direction, amount}) => ({...move(currentPosition, direction, amount)}));

    console.log(points);

    let lastY = 0;
    let insidePointsAmount = 0;
    while (points.length) {
        const topLeft = getMinPoint(points);
        const topRight = getNextPointInDirection(points, topLeft, Direction.RIGHT);
        const bottomLeft = getNextPointInDirection(points, topLeft, Direction.DOWN);
        const bottomRight = getNextPointInDirection(points, bottomLeft, Direction.RIGHT);

        const rectangleX = Math.min(topRight.x - topLeft.x, bottomRight.x - bottomLeft.x) + 1;

        const rectangleY = Math.min(bottomLeft.y - topLeft.y, bottomRight.y - topRight.y) + 1;

        console.log(topLeft, topRight, bottomLeft, bottomRight, rectangleX, rectangleY);

        if (topLeft.x + rectangleX - 1 === topRight.x) {
            points.splice(points.findIndex(({x, y}) => x === topLeft.x && y === topLeft.y), 1);
            points.splice(points.findIndex(({x, y}) => x === topRight.x && y === topRight.y), 1);
        } else {
            points.splice(points.findIndex(({x, y}) => x === topLeft.x && y === topLeft.y), 1, {
                x: topLeft.x + rectangleX - 1,
                y: topLeft.y,
            });
        }

        if (bottomLeft.x + rectangleX - 1 === bottomRight.x) {
            points.splice(points.findIndex(({x, y}) => x === bottomLeft.x && y === bottomLeft.y), 1);
            points.splice(points.findIndex(({x, y}) => x === bottomRight.x && y === bottomRight.y), 1);
        } else {
            points.splice(points.findIndex(({x, y}) => x === bottomLeft.x && y === bottomLeft.y), 1, {
                x: bottomLeft.x + rectangleX - 1,
                y: bottomLeft.y,
            });
        }

        insidePointsAmount -= Math.min(lastY, rectangleY);

        lastY = rectangleY;
        insidePointsAmount += rectangleY * rectangleX;
    }
    return insidePointsAmount;
    // const currentPosition = {
    //     x: 0,
    //     y: 0,
    // };

    // const border = new Set<string>();
    // const positionIntervals = instructions.reduce<PositionIntervals>(({minX, maxX, minY, maxY}, {direction, amount}) => {
    //     for (let i = 0; i < amount; ++i) {
    //         move(currentPosition, direction, 1);
    //         border.add(getPositionKey(currentPosition));
    //     }

    //     return {
    //         minX: Math.min(minX, currentPosition.x),
    //         maxX: Math.max(maxX, currentPosition.x),
    //         minY: Math.min(minY, currentPosition.y),
    //         maxY: Math.max(maxY, currentPosition.y),
    //     };
    // }, {
    //     minX: Number.MAX_VALUE,
    //     maxX: Number.MIN_VALUE,
    //     minY: Number.MAX_VALUE,
    //     maxY: Number.MIN_VALUE,
    // });

    // const {minX, maxX, minY, maxY} = positionIntervals;

    // const dimensions = {
    //     w: maxX - minX + 1,
    //     h: maxY - minY + 1,
    // };

    // const outsidePoints = new Map<string, Position>();
    // for (let x = minX; x <= maxX; ++x) {
    //     const point = {
    //         x,
    //         y: minY,
    //     };
    //     let key = getPositionKey(point);
    //     if (!border.has(key) && !outsidePoints.has(key)) {
    //         outsidePoints.set(key, {...point});
    //     }

    //     point.y = maxY;
    //     key = getPositionKey(point);
    //     if (!border.has(key) && !outsidePoints.has(key)) {
    //         outsidePoints.set(key, {...point});
    //     }
    // }

    // for (let y = minY; y <= maxY; ++y) {
    //     const point = {
    //         x: minX,
    //         y,
    //     };
    //     let key = getPositionKey(point);
    //     if (!border.has(key) && !outsidePoints.has(key)) {
    //         outsidePoints.set(key, {...point});
    //     }

    //     point.x = maxX;
    //     key = getPositionKey(point);
    //     if (!border.has(key) && !outsidePoints.has(key)) {
    //         outsidePoints.set(key, {...point});
    //     }
    // }

    // const activePositions = [...outsidePoints].map(([, outsidePoint]) => outsidePoint);
    // while (activePositions.length) {
    //     const position = activePositions.shift();

    //     if (!position) {
    //         return 0;
    //     }

    //     activePositions.push(...getOutsidePoints(position, outsidePoints, border, positionIntervals));
    // }

    // return dimensions.w * dimensions.h - outsidePoints.size;
};

// const getPositionKey = ({x, y}: Position): string => x + "," + y;

// const isOutbound = ({x, y}: Position, {minX, maxX, minY, maxY}: PositionIntervals): boolean => x < minX || y < minY || x > maxX || y > maxY;

// const getOutsidePoints = (position: Position, outsidePoints: Map<string, Position>, border: Set<string>, positionIntervals: PositionIntervals): Position[] => [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT].reduce<Position[]>((previous, direction) => {
//     const newPosition = move({...position}, direction, 1);
//     const key = getPositionKey(newPosition);
//     if (!isOutbound(newPosition, positionIntervals) && !border.has(key) && !outsidePoints.has(key)) {
//         outsidePoints.set(key, newPosition);
//         previous.push(newPosition);
//     }

//     return previous;
// }, []);

const move = (position: Position, direction: Direction, amount: number): Position => {
    switch (direction) {
    case Direction.UP:
        position.y -= amount;
        break;
    case Direction.DOWN:
        position.y += amount;
        break;
    case Direction.LEFT:
        position.x -= amount;
        break;
    case Direction.RIGHT:
        position.x += amount;
        break;
    }

    return position;
};

const correctInstructions = (instructions: Instruction[]): Instruction[] => instructions.map(({color}) => {
    const amount = parseInt(color.substring(0, 5), 16);
    const directionValue = parseInt(color.substring(5), 16);
    let direction = Direction.UP;
    switch (directionValue) {
    case 0:
        direction = Direction.RIGHT;
        break;
    case 1:
        direction = Direction.DOWN;
        break;
    case 2:
        direction = Direction.LEFT;
        break;
    case 3:
        direction = Direction.UP;
        break;
    }
    return {
        direction,
        amount,
        color: "",
    };
});

const getMinPoint = (points: Position[]): Position => points.reduce((previous, point) => {
    if (point.x < previous.x || point.x === previous.x && point.y < previous.y) {
        return point;
    }

    return previous;
});

const getNextPointInDirection = (points: Position[], position: Position, direction: Direction.DOWN|Direction.RIGHT): Position => {
    switch (direction) {
    case Direction.DOWN:
        return points.reduce((previous, point) => {
            if (point.x === position.x && point.y !== position.y && (previous.x === position.x && previous.y === position.y || point.y < previous.y)) {
                return point;
            }

            return previous;
        }, position);
    case Direction.RIGHT:
        return points.reduce((previous, point) => {
            if (point.y === position.y && point.x !== position.x && (previous.x === position.x && previous.y === position.y || point.x < previous.x)) {
                return point;
            }

            return previous;
        }, position);
    default:
        throw "invalid direction";
    }
};
