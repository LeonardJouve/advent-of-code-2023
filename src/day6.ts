import {readFileSync} from "node:fs";

export const day6 = (): void => {
    console.log("Day6");

    const [time, distance] = readFileSync("input/day6.txt", "utf-8")
        .split("\n")
        .map(parseLine);

    if (!time || !distance) {
        return;
    }

    firstPart(time, distance);
    secondPart(time, distance);
};

const firstPart = (time: number[], distance: number[]): void => {
    const result = time.reduce((previous, currentTime, i) => {
        const currentDistance = distance[i];

        console.log(currentTime, currentDistance);
        if (!currentDistance) {
            return previous;
        }

        let winningWays = 0;
        for (let hold = 0; hold <= currentTime; ++hold) {
            if ((currentTime - hold) * hold > currentDistance) {
                ++winningWays;
            }
        }

        if (!winningWays) {
            return previous;
        }

        return previous * winningWays;
    }, 1);

    console.log(result);
};

const secondPart = (time: number[], distance: number[]): void => {
    const joinedTime = joinRaces(time);
    const joinedDistance = joinRaces(distance);

    console.log(joinedTime, joinedDistance);

    let winningWays = 0;
    for (let hold = 0; hold <= joinedTime; ++hold) {
        if ((joinedTime - hold) * hold > joinedDistance) {
            ++winningWays;
        }
    }

    console.log(winningWays);
};

const parseLine = (line: string): number[] => line.substring(line.indexOf(":") + 1)
    .split(" ")
    .filter(Boolean)
    .map((value) => parseInt(value));

const joinRaces = (numbers: number[]): number => parseInt(numbers.map((number) => String(number)).join(""));
