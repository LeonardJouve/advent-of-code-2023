import {readFileSync} from "fs";

type Valley = {
    rows: string[];
    columns: string[];
};

export const day13 = (): void => {
    console.log("Day13");

    const input = readFileSync("input/day13.txt", "utf-8");

    const valleys = input.split("\n\n").map<Valley>((valley) => {
        const rows = valley.split("\n").filter(Boolean);
        return {
            rows,
            columns: valley.split("")
                .map((_, i) => rows.reduce((previous, row) => previous + (row[i] ?? ""), ""))
                .filter(Boolean),
        };
    });

    firstPart(valleys);
    secondPart(valleys);
};

const firstPart = (valleys: Valley[]): void => {
    const result = valleys.reduce((previous, {rows, columns}) => previous + findReflection(rows, 0) * 100 + findReflection(columns, 0), 0);

    console.log(result);
};

const secondPart = (valleys: Valley[]): void => {
    const result = valleys.reduce((previous, {rows, columns}) => previous + findReflection(rows, 1) * 100 + findReflection(columns, 1), 0);

    console.log(result);
};

const findReflection = (lines: string[], targetDifference: number): number => {
    for (let i = 1; i < lines.length; ++i) {
        if (testReflection(lines, i, targetDifference)) {
            return i;
        }
    }

    return 0;
};

const testReflection = (lines: string[], axis: number, targetDifference: number): boolean => {
    let difference = 0;
    for (let i = 0; axis - i - 1 >= 0 && axis + i < lines.length; ++i) {
        const firstLine = lines[axis - i - 1];
        const secondLine = lines[axis + i];

        if (!firstLine || !secondLine) {
            continue;
        }

        difference += getLineDifference(firstLine, secondLine);
    }

    return difference === targetDifference;
};

const getLineDifference = (firstLine: string, secondLine: string): number => firstLine.split("").reduce((previous, character, i) => character !== secondLine[i] ? previous + 1 : previous, 0);
