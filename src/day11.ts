import {readFileSync} from "fs";

type Position = {
    x: number;
    y: number;
};

export const day11 = (): void => {
    console.log("Day11");

    const input = readFileSync("input/day11.txt", "utf-8");

    const lines = input.split("\n")
        .filter(Boolean);

    const galaxies = lines.reduce<Position[]>((previous, line, y) => {
        for (let x = line.indexOf("#"); x !== -1; x = line.indexOf("#", x + 1)) {
            previous.push({
                x,
                y,
            });
        }
        return previous;
    }, []);

    const yHoles = lines.reduce<number[]>((previous, line, i) => {
        if (line.includes("#")) {
            return previous;
        }

        previous.push(i);

        return previous;
    }, []);

    const xHoles = lines.reduce<number[]>((previous, _, i, self) => {
        if (self.some((line) => line[i] !== ".")) {
            return previous;
        }

        previous.push(i);

        return previous;
    }, []);

    firstPart(galaxies, xHoles, yHoles);
    secondPart(galaxies, xHoles, yHoles);
};

const firstPart = (galaxies: Position[], xHoles: number[], yHoles: number[]): void => {
    const universe = expandUniverse(galaxies, xHoles, yHoles, 1);

    const sum = getGalaxiesDistanceSum(universe);

    console.log(sum);
};

const secondPart = (galaxies: Position[], xHoles: number[], yHoles: number[]): void => {
    const universe = expandUniverse(galaxies, xHoles, yHoles, 999999);

    const sum = getGalaxiesDistanceSum(universe);

    console.log(sum);
};

const manhattanDistance = ({x: x1, y: y1}: Position, {x: x2, y: y2}: Position): number => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const expandUniverse = (galaxies: Position[], xHoles: number[], yHoles: number[], size: number): Position[] => {
    const xExpanded = xHoles.reduce((previous, xHole) => previous.map(({x, y}, i) => ({
        x: (galaxies[i]?.x ?? 0) > xHole ? x + size : x,
        y,
    })), galaxies);

    return yHoles.reduce<Position[]>((previous, yHole) => previous.map(({x, y}, i) => ({
        x,
        y: (galaxies[i]?.y ?? 0) > yHole ? y + size : y,
    })), xExpanded);
};

const getGalaxiesDistanceSum = (galaxies: Position[]): number => {
    let sum = 0;
    for (let i = 0; i < galaxies.length; ++i) {
        for (let j = i + 1; j < galaxies.length; ++j) {
            const firstGalaxy = galaxies[i];
            const secondGalaxy = galaxies[j];

            if (!firstGalaxy || !secondGalaxy) {
                continue;
            }

            sum += manhattanDistance(firstGalaxy, secondGalaxy);
        }
    }

    return sum;
};
