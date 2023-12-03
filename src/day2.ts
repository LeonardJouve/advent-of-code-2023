import {readFileSync} from "node:fs";

type Round = {
    red: number;
    green: number;
    blue: number;
};

type Game = {
    id: number;
    rounds: Round[];
};

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

export const day2 = (): void => {
    console.log("Day2");

    const input = readFileSync("input/day2.txt", "utf-8");

    firstPart(input);
    secondPart(input);
};

const firstPart = (input: string): void => {
    const result = input.split("\n").reduce((sum, line) => {
        if (!line.length) {
            return sum;
        }

        const game = parseGame(line);

        if (game.rounds.every((round) => round.red <= MAX_RED && round.green <= MAX_GREEN && round.blue <= MAX_BLUE)) {
            return sum + game.id;
        }

        return sum;
    }, 0);

    console.log(result);
};

const secondPart = (input: string): void => {
    const result = input.split("\n").reduce((sum, line) => {
        if (!line.length) {
            return sum;
        }

        const game = parseGame(line);

        const set = game.rounds.reduce((previous, round) => ({
            red: Math.max(previous.red, round.red),
            green: Math.max(previous.green, round.green),
            blue: Math.max(previous.blue, round.blue),
        }), {
            red: 0,
            green: 0,
            blue: 0,
        });

        return sum + set.red * set.green * set.blue;
    }, 0);

    console.log(result);
};

const parseGame = (line: string): Game => {
    const id = getPrefixedValue(line, "Game ");

    const rounds = line.substring(line.indexOf(":"))
        .split(";")
        .map<Round>((round) => ({
            red: getSuffixedValue(round, " red"),
            green: getSuffixedValue(round, " green"),
            blue: getSuffixedValue(round, " blue"),
        }));

    return {
        id,
        rounds,
    };
};

const getPrefixedValue = (line: string, prefix: string): number => {
    let start = line.indexOf(prefix);
    if (start === -1) {
        return 0;
    }
    start += prefix.length;

    let isOutbound = false;
    const end = line.substring(start)
        .split("")
        .reduce((previous, character) => {
            if (!isOutbound && isNumeric(character)) {
                return previous + 1;
            }

            isOutbound = true;

            return previous;
        }, start + 1);

    return parseInt(line.substring(start, end));
};

const getSuffixedValue = (line: string, prefix: string): number => {
    const end = line.indexOf(prefix);
    if (end === -1) {
        return 0;
    }

    let isOutbound = false;
    const start = line.substring(0, end)
        .split("")
        .reverse()
        .reduce((previous, character) => {
            if (!isOutbound && isNumeric(character)) {
                return previous - 1;
            }

            isOutbound = true;

            return previous;
        }, end);

    return parseInt(line.substring(start, end));
};


const isNumeric = (character: string): boolean => character.charCodeAt(0) >= "0".charCodeAt(0) && character.charCodeAt(0) <= "9".charCodeAt(0);
