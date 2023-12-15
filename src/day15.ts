import {readFileSync} from "node:fs";

type Boxe = {
    values: Record<string, {
        position: number;
        focalLength: number;
    }>;
    maxPosition: number;
};

type Sequence = {
    label: string;
    focalLength?: number;
};

export const day15 = (): void => {
    console.log("Day15");

    const input = readFileSync("input/day15.txt", "utf-8");

    const sequences = input.replaceAll("\n", "")
        .split(",");

    firstPart(sequences);
    secondPart(sequences);
};

const firstPart = (sequences: string[]): void => {
    const sum = sequences.reduce((previous, sequence) => previous + hash(sequence), 0);

    console.log(sum);
};

const secondPart = (sequences: string[]): void => {
    const sum = sequences.map<Sequence>((sequence) => {
        const [label, instruction] = sequence.split(/[=-]/g);
        return {
            label: label ?? "",
            focalLength: instruction?.length ? parseInt(instruction) : undefined,
        };
    }).reduce<Boxe[]>((previous, {label, focalLength}) => {
        const boxIndex = hash(label);
        const box = previous[boxIndex];

        if (!box) {
            return previous;
        }
        const {values} = box;

        if (focalLength === undefined) {
            const position = values[label]?.position;
            if (position === undefined) {
                return previous;
            }

            Object.keys(values).forEach((boxLabel) => {
                const lens = values[boxLabel];
                if (lens && lens.position > position) {
                    --lens.position;
                }
            });
            delete values[label];
            --box.maxPosition;

            return previous;
        }

        const lens = values[label];
        if (lens) {
            lens.focalLength = focalLength;

            return previous;
        }


        values[label] = {
            position: box.maxPosition++,
            focalLength,
        };

        return previous;
    }, Array.from({length: 256}, () => ({
        values: {},
        maxPosition: 0,
    })))
        .reduce((previous, {values}, i) => previous + Object.values(values).reduce((boxSum, {position, focalLength}) => boxSum + (i + 1) * (position + 1) * focalLength, 0), 0);

    console.log(sum);
};

const hash = (sequence: string): number => sequence.split("").reduce((previous, character) => (previous + character.charCodeAt(0)) * 17 % 256, 0);
