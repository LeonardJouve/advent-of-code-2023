import {readFileSync} from "fs";

type Sequence = number[];

type History = Sequence[];

export const day9 = (): void => {
    const input = readFileSync("input/day9.txt", "utf-8");

    const histories = input.split("\n")
        .filter(Boolean)
        .map((line) => line.split(" ")
            .map((value) => parseInt(value)))
        .map<History>((report) => {
            const sequences: Sequence[] = [report];
            let lastSequence = report;

            while (lastSequence.some((value) => value !== 0)) {
                const nextSequence = getNextSequence(lastSequence);
                sequences.push(nextSequence);
                lastSequence = nextSequence;
            }

            return sequences;
        });

    firstPart(histories);
    secondPart(histories);
};

const firstPart = (histories: History[]): void => {
    const sum = histories.reduce((previous, history) => previous + history.reduce((prediction, sequence) => prediction + (sequence.at(-1) ?? 0), 0), 0);

    console.log(sum);
};

const secondPart = (histories: History[]): void => {
    const sum = histories.reduce((previous, history) => previous + history.reduce((prediction, sequence, i) => prediction + (sequence.at(0) ?? 0) * (i % 2 ? -1 : 1), 0), 0);

    console.log("second", sum);
};

const getNextSequence = (lastSequence: Sequence): Sequence => lastSequence.reduce<Sequence>((previous, sequence, i, self) => {
    if (!i) {
        return previous;
    }

    const previousSequence = self[i - 1];

    if (previousSequence === undefined) {
        return previous;
    }

    previous.push(sequence - previousSequence);

    return previous;
}, []);
