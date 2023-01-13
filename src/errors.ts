export class UnlinkedEventError extends Error {
    constructor(name: string, bus: string) {
        super(`Event '${name}' is not linked to bus '${bus}'`);
    }
}