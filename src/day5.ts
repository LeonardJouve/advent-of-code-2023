import {readFileSync} from "fs";

type Range = {
    destinationStart: number;
    sourceStart: number;
    amount: number;
};

type Section = {
    name: string;
    ranges: Range[];
};

export const day5 = (): void => {
    console.log("Day5");

    const [seedsLine, ...sectionsLines] = readFileSync("input/day5.txt", "utf-8").split("\n\n");

    if (!seedsLine) {
        return;
    }

    const sections = parseSections(sectionsLines);

    firstPart(seedsLine, sections);
    secondPart(seedsLine, sections);
};

const firstPart = (seedsLine: string, sections: Section[]): void => {
    const seeds = seedsLine.substring(seedsLine.indexOf(":") + 1)
        .split(" ")
        .filter(Boolean)
        .map((value) => parseInt(value));


    console.log(getMinValue(sections, seeds));
};

const getMinValue = (sections: Section[], seeds: number[]): number => sections.reduce((previous, section) => previous.map((value) => convertValue(value, section.ranges)), seeds)
    .reduce((previous, value) => Math.min(previous, value), Number.MAX_VALUE);

const secondPart = (seedsLine: string, sections: Section[]): void => {
    // const seeds = seedsLine.substring(seedsLine.indexOf(":") + 1)
    //     .split(" ")
    //     .filter(Boolean)
    //     .map((value) => parseInt(value));

    seedsLine;
    sections;
};

const parseSections = (sectionsLines: string[]): Section[] => sectionsLines.map<Section>((sectionLines) => {
    const [nameLine, ...rangesLines] = sectionLines.split("\n");

    if (!nameLine) {
        return {
            name: "",
            ranges: [],
        };
    }

    const name = nameLine.substring(0, nameLine.indexOf(":"));

    const ranges = rangesLines.map<Range>((rangeLine) => {
        const [destinationStart, sourceStart, amount] = rangeLine.split(" ").map((value) => parseInt(value));

        return {
            destinationStart: destinationStart ?? 0,
            sourceStart: sourceStart ?? 0,
            amount: amount ?? 0,
        };
    });

    return {
        name,
        ranges,
    };
});

const convertValue = (value: number, ranges: Range[]): number => {
    for (const {destinationStart, sourceStart, amount} of ranges) {
        if (value >= sourceStart && value < sourceStart + amount) {
            return destinationStart + value - sourceStart;
        }
    }

    return value;
};
