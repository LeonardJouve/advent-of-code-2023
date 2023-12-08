import {readFileSync} from "fs";

type Node = {
    L: string;
    R: string;
};

type Nodes = Record<string, Node>;

type Instruction = keyof Node;

export const day8 = (): void => {
    const input = readFileSync("input/day8.txt", "utf-8");

    const [instructionsLine, ...lines] = input.split("\n").filter(Boolean);

    if (!instructionsLine) {
        return;
    }

    const instructions = instructionsLine.split("") as Instruction[];
    const nodes = lines.reduce<Nodes>((previous, line) => {
        const [name, neighbors] = line.split(" = ");

        if (!name || !neighbors) {
            return previous;
        }

        const [L, R] = neighbors.substring(1, neighbors.length - 1).split(", ");

        if (!L || !R) {
            return previous;
        }

        previous[name] = {
            L,
            R,
        };

        return previous;
    }, {});

    firstPart(instructions, nodes);
    secondPart(instructions, nodes);
};

const firstPart = (instructions: Instruction[], nodes: Nodes): void => {
    const count = getCount(instructions, nodes, "AAA", "ZZZ");

    console.log(count);
};

const secondPart = (instructions: Instruction[], nodes: Nodes): void => {
    const counts = Object.keys(nodes)
        .filter((nodeName) => nodeName.endsWith("A"))
        .map((nodeName) => getCount(instructions, nodes, nodeName, "Z"));

    counts.forEach((count) => {
        if (count % instructions.length !== 0) {
            throw `invalid count ${count}`;
        }
    });

    const reducedCounts = counts.map((count) => count / instructions.length);
    const max = reducedCounts.reduce((previous, count) => Math.max(previous, count), 0);

    let total = 0;
    do {
        total += max;
    } while (reducedCounts.some((reducedCount) => total % reducedCount));
    total *= instructions.length;

    console.log(total);
};

const getCount = (instructions: Instruction[], nodes: Nodes, start: string, end: string): number => {
    let nodeName = start;
    let count = 0;

    while (!nodeName.endsWith(end)) {
        for (const instruction of instructions) {
            const node = nodes[nodeName];

            if (!node) {
                continue;
            }

            nodeName = node[instruction];
            ++count;
        }
    }

    return count;
};
