import {readFileSync} from "fs";

type Workflow = {
    name: string;
    instructions: Instruction[];
};

type Part = {
    x: number;
    m: number;
    a: number;
    s: number;
};

enum Comparaison {
    INFERIOR = "<",
    SUPERIOR = ">",
}

enum State {
    ACCEPT = "A",
    REJECT = "R",
}

type Instruction = {
    parameter?: keyof Part;
    comparaison?: Comparaison;
    comparator?: number;
    state: string | State;
};

export const day19 = (): void => {
    console.log("Day19");

    const [workflowsLines, partsLines] = readFileSync("input/day19.txt", "utf-8")
        .split("\n\n");

    if (!workflowsLines || !partsLines) {
        throw "invalid input";
    }

    const workflows = workflowsLines.split("\n")
        .filter(Boolean)
        .map<Workflow>((line) => {
            const name = line.substring(0, line.indexOf("{"));
            const instructions = line.substring(line.indexOf("{") + 1, line.indexOf("}"))
                .split(",")
                .map<Instruction>((instruction) => {
                    if (instruction.includes(":")) {
                        const [condition, target] = instruction.split(":");
                        if (!condition || !target) {
                            throw "invalid input";
                        }

                        let parameter, comparator, comparaison;
                        if (condition.includes("<")) {
                            comparaison = Comparaison.INFERIOR;
                            [parameter, comparator] = condition.split("<");
                        } else if (condition.includes(">")) {
                            comparaison = Comparaison.SUPERIOR;
                            [parameter, comparator] = condition.split(">");
                        }

                        if (!parameter || !comparaison || !comparator) {
                            throw "invalid input";
                        }

                        return {
                            parameter: parameter as keyof Part,
                            comparaison,
                            comparator: parseInt(comparator),
                            state: target,
                        };
                    }

                    return {
                        state: instruction as State,
                    };
                });

            return {
                name,
                instructions,
            };
        });

    const parts = partsLines.split("\n")
        .filter(Boolean)
        .map<Part>((line) => line.substring(line.indexOf("{") + 1, line.indexOf("}"))
            .split(",")
            .reduce<Part>((previous, parameter) => {
                const [key, value] = parameter.split("=");
                previous[key as keyof Part] = parseInt(value ?? "0");

                return previous;
            }, {
                x: 0,
                m: 0,
                a: 0,
                s: 0,
            }));

    firstPart(workflows, parts);
};

const firstPart = (workflows: Workflow[], parts: Part[]): void => {
    const rating = parts.reduce((previous, part) => {
        let currentWorkflow: string|State = "in";
        while (currentWorkflow !== State.ACCEPT && currentWorkflow !== State.REJECT) { // eslint-disable-line @typescript-eslint/no-unsafe-enum-comparison
            const workflow = workflows.find(({name}) => name === currentWorkflow);
            if (!workflow) {
                throw "invalid input";
            }

            for (const instruction of workflow.instructions) {
                if (testInstruction(part, instruction)) {
                    currentWorkflow = instruction.state;
                    break;
                }
            }
        }

        if (currentWorkflow === State.REJECT) {
            return previous;
        }

        return previous + Object.values(part).reduce((sum, value) => sum + value, 0);
    }, 0);

    console.log(rating);
};

const testInstruction = (part: Part, {parameter, comparaison, comparator}: Instruction): boolean => {
    if (!parameter || !comparaison || comparator === undefined) {
        return true;
    }

    return comparaison === Comparaison.INFERIOR ? part[parameter] < comparator : part[parameter] > comparator;
};
