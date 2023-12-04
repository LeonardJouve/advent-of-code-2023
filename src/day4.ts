import {readFileSync} from "fs";

export const day4 = (): void => {
    console.log("Day4");

    const input = readFileSync("input/day4.txt", "utf-8");

    firstPart(input);
    secondPart(input);
};

const firstPart = (input: string): void => {
    const points = input.split("\n")
        .reduce((previous, line) => {
            const [, game] = line.split(":");

            if (!game) {
                return previous;
            }

            const [winning, obtained] = game.split("|");

            if (!winning || !obtained) {
                return previous;
            }

            const obtainedNumbers = parseNumbers(obtained);

            const amount = parseNumbers(winning).reduce((sum, winningNumber) => obtainedNumbers.includes(winningNumber) ? sum + 1 : sum, 0);

            return amount > 0 ? previous + Math.pow(2, amount - 1) : previous;
        }, 0);

    console.log(points);
};


const secondPart = (input: string): void => {
    const cardSet: Record<number, number> = {};

    const lines = input.split("\n").filter(Boolean);

    lines.forEach((line) => {
        const [header, game] = line.split(":");

        if (!header || !game) {
            return;
        }

        const [winning, obtained] = game.split("|");

        if (!winning || !obtained) {
            return;
        }

        const [, cardNumber] = header.split(" ")
            .filter(Boolean)
            .map((value) => parseInt(value));

        if (!cardNumber) {
            return;
        }

        const cardAmount = cardSet[cardNumber] ?? 0;

        const obtainedNumbers = parseNumbers(obtained);

        parseNumbers(winning).filter((winningNumber) => obtainedNumbers.includes(winningNumber))
            .forEach((_, i) => {
                const currentCardAmount = cardSet[cardNumber + i + 1] ?? 0;

                cardSet[cardNumber + i + 1] = currentCardAmount + cardAmount + 1;
            });
    }, 0);

    const sum = Object.values(cardSet).reduce((previous, amount) => previous + amount, lines.length);

    console.log(sum);
};

const parseNumbers = (input: string): number[] => input.split(" ")
    .filter(Boolean)
    .map((number) => parseInt(number));
