"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlinkedEventError = void 0;
class UnlinkedEventError extends Error {
    constructor(name, bus) {
        super(`Event '${name}' is not linked to bus '${bus}'`);
    }
}
exports.UnlinkedEventError = UnlinkedEventError;
