import {readFileSync} from "node:fs";

const DIGITS = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
};

export const day1 = (): void => {
    console.log("Day1");

    const input = readFileSync("input/day1.txt", "utf-8");

    resolve(input, /(?=(\d))/g);
    resolve(input, /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g);
};

const resolve = (input: string, regexp: RegExp): void => {
    const result = input
        .split("\n")
        .reduce((sum, line) => sum + getCalibrationValue(line, regexp), 0);

    console.log(result);
};

const getCalibrationValue = (line: string, regexp: RegExp): number => {
    const matches = [...line.matchAll(regexp)];

    if (!matches.length) {
        return 0;
    }

    const firstMatch = matches.at(0)?.at(1);
    const lastMatch = matches.at(-1)?.at(1);

    if (!firstMatch || !lastMatch) {
        return 0;
    }

    const firstDigit = Object.entries(DIGITS)
        .reduce((previous, [key, value]) => previous === key ? String(value) : previous, firstMatch);

    const lastDigit = Object.entries(DIGITS)
        .reduce((previous, [key, value]) => previous === key ? String(value) : previous, lastMatch);


    return parseInt(firstDigit + lastDigit);
};
