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

type SeedRange = {
    start: number;
    end: number;
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
    const seedsRanges = seedsLine.substring(seedsLine.indexOf(":") + 1)
        .split(" ")
        .filter(Boolean)
        .map((value) => parseInt(value))
        .reduce<SeedRange[]>((ranges, value, i, self) => {
            if (!(i % 2)) {
                return ranges;
            }

            const start = self.at(i - 1);

            if (!start) {
                return ranges;
            }

            ranges.push({
                start,
                end: start + value,
            });

            return ranges;
        }, []);

    const min = seedsRanges.reduce((previous, {start, end}) => {
        console.log("Range", start, end);

        let minValue = previous;

        for (let seed = start; seed < end; ++seed) {
            const newMin = getMinValue(sections, [seed]);

            if (minValue < newMin) {
                continue;
            }

            minValue = newMin;
        }

        return minValue;
    }, Number.MAX_VALUE);

    console.log(min);
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
