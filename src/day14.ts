import {readFileSync} from "fs";

enum Direction {
    TOP,
    LEFT,
    BOTTOM,
    RIGHT,
}

export const day14 = (): void => {
    console.log("Day14");

    const input = readFileSync("input/day14.txt", "utf-8");

    const lines = input.split("\n").filter(Boolean);

    firstPart(lines);
    secondPart(lines);
};

const firstPart = (lines: string[]): void => {
    const sum = restoreBoard(tiltBoard(lines, Direction.TOP).map((column) => tiltColumn(column)), Direction.TOP).reduce((previous, column, i) => previous + getScore(column, i, lines.length), 0);

    console.log(sum);
};

const secondPart = (lines: string[]): void => {
    const cycles = 4 * 1000000000;
    let index = -1;
    let columns = lines.map((line) => line.split("")
        .reverse()
        .join(""));
    const results = [];
    const resultsMap = new Map<string, number>();


    for (let i = 0; i < cycles; ++i) {
        columns = tiltBoard(columns, i % 4).map((column) => tiltColumn(column));

        if (resultsMap.has(columns.join(""))) {
            const result = resultsMap.get(columns.join(""));

            if (!result) {
                continue;
            }

            index = result + (cycles - result - 1) % (i - result);
            break;
        }

        resultsMap.set(columns.join(""), i);
        results.push(columns);
    }

    const resultTarget = results[index];

    if (!resultTarget) {
        return;
    }

    const sum = restoreBoard(resultTarget, index % 4).reduce((previous, column, i) => previous + getScore(column, i, resultTarget.length), 0);

    console.log(sum);
};

const getScore = (column: string, lineIndex: number, lineAmount: number): number => column.split("").reduce((previous, character) => character === "O" ? previous + lineAmount - lineIndex : previous, 0);

const tiltColumn = (column: string): string => column.split("")
    .reduce((previous, character, i) => {
        const prefix = previous.substring(0, i);
        if (character === "O") {
            const newColumn = previous.split("");
            newColumn.splice(i, 1, ".");
            newColumn.splice(Math.max(prefix.lastIndexOf("#"), prefix.lastIndexOf("O")) + 1, 1, character);
            return newColumn.join("");
        }
        return previous;
    }, column);

const rotateLines = (lines: string[]): string[] => (lines[0] ?? "").split("")
    .map((_, i) => lines.reduce((previous, row) => previous + (row[i] ?? ""), ""))
    .filter(Boolean);

const reverseLines = (lines: string[]): string[] => lines.map((line) => line.split("")
    .reverse()
    .join(""));

const tiltBoard = (board: string[], direction: Direction): string[] => {
    switch (direction) {
    case Direction.TOP:
        return rotateLines(reverseLines(board));
    case Direction.LEFT:
        return rotateLines(board);
    case Direction.BOTTOM:
        return reverseLines(rotateLines(board));
    case Direction.RIGHT:
        return reverseLines(rotateLines(reverseLines(board)));
    default:
        return board;
    }
};

const restoreBoard = (board: string[], direction: Direction): string[] => {
    switch (direction) {
    case Direction.TOP:
        return rotateLines(board);
    case Direction.LEFT:
        return board;
    case Direction.BOTTOM:
        return rotateLines(reverseLines(board));
    case Direction.RIGHT:
        return reverseLines(board);
    default:
        return board;
    }
};
