import {readFileSync} from "node:fs";

type Position = {
    x: number;
    y: number;
};

type Dimension = {
    w: number;
    h: number;
};

type Number = {
    position: Position;
    value: number;
};

type Gear = [number, number];

export const day3 = (): void => {
    console.log("Day3");

    const lines = readFileSync("input/day3.txt", "utf-8").split("\n");

    firstPart(lines);
    secondPart(lines);
};

const firstPart = (lines: string[]): void => {
    const sum = lines.reduce<Number[]>((previous, line, y) => {
        line.split("").forEach((character, x) => {
            if (isSymbol(character)) {
                getNeighbors({x, y}, {
                    w: line.length,
                    h: lines.length,
                }).forEach((neighbor) => {
                    const element = lines.at(neighbor.y)?.at(neighbor.x);
                    const neighborLine = lines[neighbor.y];
                    if (!element || !isNumber(element) || !neighborLine) {
                        return;
                    }

                    previous.push(getNumber(neighborLine, neighbor));
                });
            }
        });

        return previous;
    }, [])
        .filter((coordinate, i, self) => self.findIndex(({position}) => position.x === coordinate.position.x && position.y === coordinate.position.y) === i)
        .reduce((previous, coordinate) => previous + coordinate.value, 0);


    console.log(sum);
};

const secondPart = (lines: string[]): void => {
    const sum = lines.reduce<Gear[]>((gears, line, y) => {
        line.split("").forEach((character, x) => {
            if (isGear(character)) {
                const numbers = getNeighbors({x, y}, {
                    w: line.length,
                    h: lines.length,
                }).reduce<Number[]>((previous, neighbor) => {
                    const element = lines.at(neighbor.y)?.at(neighbor.x);
                    const neighborLine = lines[neighbor.y];
                    if (!element || !isNumber(element) || !neighborLine) {
                        return previous;
                    }

                    const {position, value} = getNumber(neighborLine, neighbor);

                    if (!previous.find((number) => number.position.x === position.x && number.position.y === position.y)) {
                        previous.push({
                            position,
                            value,
                        });
                    }

                    return previous;
                }, []);

                const gear = numbers.map(({value}) => value);
                if (gear.length !== 2) {
                    return;
                }

                gears.push(gear as Gear);
            }
        });

        return gears;
    }, [])
        .reduce((previous, [first, second]) => previous + first * second, 0);


    console.log(sum);
};

const getNumber = (line: string, position: Position): Number => {
    let isOutbound = false;
    const start = line.substring(0, position.x)
        .split("")
        .reverse()
        .reduce((previous, character) => {
            if (!isOutbound && isNumber(character)) {
                return previous - 1;
            }

            isOutbound = true;

            return previous;
        }, position.x);

    isOutbound = false;
    const end = line.substring(position.x + 1)
        .split("")
        .reduce((previous, character) => {
            if (!isOutbound && isNumber(character)) {
                return previous + 1;
            }

            isOutbound = true;

            return previous;
        }, position.x + 1);

    return {
        position: {
            x: start,
            y: position.y,
        },
        value: parseInt(line.substring(start, end)),
    };
};

const isGear = (character: string): boolean => character === "*";

const isNumber = (character: string): boolean => character.charCodeAt(0) >= "0".charCodeAt(0) && character.charCodeAt(0) <= "9".charCodeAt(0);

const isSymbol = (character: string): boolean => !isNumber(character) && character !== ".";

const getNeighbors = (position: Position, dimension: Dimension): Position[] => {
    const neighbors: Position[] = [];

    for (let x = -1; x <= 1; ++x) {
        for (let y = -1; y <= 1; ++y) {
            if (x === 0 && y === 0) {
                continue;
            }

            if (position.x + x < 0 || position.x + x >= dimension.w || position.y + y < 0 || position.y + y >= dimension.h) {
                continue;
            }

            neighbors.push({
                x: position.x + x,
                y: position.y + y,
            });
        }
    }

    return neighbors;
};
