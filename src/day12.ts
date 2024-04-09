import {readFileSync} from "fs";
import {Worker} from "worker_threads";

export type Spring = {
    springs: string;
    length: number[];
};

export const day12 = (): void => {
    const input = readFileSync("input/day12.txt", "utf-8");

    const springsList = input.split("\n")
        .filter(Boolean)
        .map<Spring>((line) => {
            const [springs, length] = line.split(" ");

            return {
                springs: springs ?? "",
                length: length?.split(",").map((value) => parseInt(value)) ?? [0],
            };
        });

    firstPart(springsList);
    secondPart(springsList);
};

const firstPart = (springsList: Spring[]): void => {
    const sum = springsList.reduce((previous, spring) => previous + getSpringPossibilities(spring), 0);

    console.log(sum);
};

const secondPart = (springsList: Spring[]): void => {
    const unfoldedSpringsList = springsList.map(({springs, length}) => ({
        springs: ("?" + springs).repeat(5).substring(1),
        length: [
            ...length,
            ...length,
            ...length,
            ...length,
            ...length,
        ],
    }));

    let processedChunks = 0;
    let sum = 0;
    const CHUNK_AMOUNT = 16;
    splitInChunks(unfoldedSpringsList, CHUNK_AMOUNT).forEach((chunk) => {
        const worker = new Worker("./dist/day12-worker.js");
        worker.postMessage(chunk);

        worker.on("message", (result: number) => {
            ++processedChunks;
            sum += result;
            if (processedChunks === CHUNK_AMOUNT) {
                console.log("sum:", sum);
            }
        });
    });
    // const sum = unfoldedSpringsList.reduce((previous, spring, i) => {
    //     const result = previous + getSpringPossibilities(spring);
    //     appendFileSync("out.txt", String(result) + " " + i + " \n", "utf-8");
    //     console.log(i, result);
    //     return result;
    // }, 0);

    // console.log(sum);
};

// const savedPossibilities = new Map<string, Record<number, string[]>>();

export const getSpringPossibilities = ({springs, length}: Spring): number => {
    const [springLength, ...restLength] = length;
    if (!springs.length || !springs.includes("#") && !springs.includes("?") || springLength === undefined) {
        return 0;
    }

    const firstSpring = springs.indexOf("#");
    const firstUnknown = springs.indexOf("?");
    const start = !springs.includes("#") ? firstUnknown : !springs.includes("?") ? firstSpring : Math.min(firstSpring, firstUnknown);
    const end = !springs.includes("#") ? springs.length : firstSpring + springLength;
    const subSpring = springs.substring(start, end);

    // if (savedPossibilities.has(subSpring)) {
    //     const possibilities = savedPossibilities.get(subSpring)?.[springLength];

    //     if (possibilities) {
    //         const suffix = springs.substring(end);
    //         return possibilities.reduce((previous, possibilitySubSpring) => {
    //             console.log(springs, possibilitySubSpring + suffix);
    //             return previous + getSpringPossibilities({
    //                 springs: possibilitySubSpring + suffix,
    //                 length: restLength,
    //             });
    //         }, 0);
    //     }
    // }

    // const subStringPossibilities: string[] = [];
    let possibilities = 0;
    for (let i = 0; i <= subSpring.length - springLength; ++i) {
        if (subSpring.substring(i, i + springLength).includes(".") || springs.at(start + i + springLength) === "#") {
            continue;
        }

        const newSprings = springs.substring(start + i + springLength + 1);

        // if (subSpring.substring(i + springLength + 1).length !== subSpring.length) {
        //     console.log("error", subSpring.substring(i + springLength + 1), subSpring);
        // }

        // subStringPossibilities.push(springs.substring(start + i + springLength + 1, end));

        if (!restLength.length && !newSprings.includes("#")) {
            ++possibilities;
        }

        possibilities += getSpringPossibilities({
            springs: newSprings,
            length: restLength,
        });
    }

    // console.log(subStringPossibilities);
    // if (savedPossibilities.has(subSpring)) {
    //     const savedSubSpring = savedPossibilities.get(subSpring);
    //     if (savedSubSpring && !savedSubSpring[springLength]) {
    //         savedSubSpring[springLength] = subStringPossibilities;
    //     }
    // } else {
    //     savedPossibilities.set(subSpring, {[springLength]: subStringPossibilities});
    // }

    return possibilities;
};

const splitInChunks = (springsList: Spring[], amount: number): Spring[][] => {
    const chunks = [];

    const copy = [...springsList];
    for (let i = amount; i > 0; --i) {
        chunks.push(copy.splice(0, Math.ceil(copy.length / i)));
    }

    return chunks;
};
