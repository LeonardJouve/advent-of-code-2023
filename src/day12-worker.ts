import {parentPort} from "worker_threads";
import {getSpringPossibilities, type Spring} from "./day12.js";
import {exit} from "process";


parentPort?.on("message", (springsList: Spring[]) => {
    const sum = springsList.reduce((previous, spring) => {
        const result = previous + getSpringPossibilities(spring);
        return result;
    }, 0);

    parentPort?.postMessage(sum);
    exit();
});
