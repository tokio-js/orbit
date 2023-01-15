"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.Bus = void 0;
const errors_1 = require("./errors");
/**
 * # Orbit Event Bus
 * ### Used to subscibe and post events to
 * Example:
 * ```ts
 * import { SomeEvent } from "some_library";
 * import orbit from "orbit";
 *
 * const BUS = new orbit.Bus();
 *
 * SomeEvent.link(BUS)
 *
 * BUS.on("SomeEvent", async event => {
 *     console.log("Event Recieved !");
 *     console.log(event);
 * });
 * ```
 */
class Bus {
    #name;
    #registered_events;
    #subscribers = new Map();
    #__orbit_validate__ = (e) => {
        if (typeof e === "string") {
            if (!this.#registered_events.includes(e))
                throw new errors_1.UnlinkedEventError(e, this.#name);
            return e;
        }
        return this.#__orbit_validate__(Event.__raw_orbit_event__(e).name);
    };
    /**
     * @param {string | undefined} name The name of the bus
     */
    constructor(name) {
        this.#name = name || "ORBIT_BUS_" + Date.now();
        this.#registered_events = [];
    }
    /**
     * ## Registers an event handler for a specific event
     * @param {string} eventname name of the event that it is listening (case sensitive)
     * @param {Consumer<E2>} func function that handles the event
     * @throws {UnlinkedEventError} if the event is not linked to the bus
     * @throws {TypeError} if the event is not an instance of an orbit event
     * @returns {void}
     */
    on(eventname, func) {
        eventname = this.#__orbit_validate__(eventname);
        if (this.#subscribers.get(eventname) === undefined)
            this.#subscribers.set(eventname, []);
        this.#subscribers.get(eventname).push(func);
    }
    /**
     * ## Posts an event to the bus
     * @param {E} event event to post
     * @returns {void}
     * @throws {UnlinkedEventError} if the event is not linked to the bus
     * @throws {TypeError} if the event is not an instance of an orbit event
     */
    post(event) {
        let eventname = this.#__orbit_validate__(event);
        if (this.#subscribers.get(eventname) !== undefined) {
            this.#subscribers.get(eventname).forEach(func => func(event));
        }
    }
    __orbit_link_event__(event) { this.#registered_events.push(event); }
}
exports.Bus = Bus;
/**
 * # Orbit Event
 * ### Used to create custom events for the Orbit Bus
 * Exmaple:
 * ```ts
 * import * as orbit from "orbit";
 *
 * class PlayerJoinEvent extends orbit.Event {
 *     public username: string;
 *     constructor(username: string) {
 *         super("PlayerJoinEvent");
 *         this.username = username;
 *     }
 * }
 *
 * PlayerJoinEvent.link(BUS)
 *
 * BUS.on<PlayerJoinEvent>("PlayerJoinEvent", async player => {
 *     console.log("Player Joined: " + player.username);
 * });
 *
 * BUS.post(
 *     new PlayerJoinEvent("James Bond")
 * );
 * ```
 */
class Event {
    #__orbit_event__;
    constructor(name) {
        this.#__orbit_event__ = {
            creation_timestamp: Date.now(),
            name: name
        };
    }
    /**
     * # Links the event to any Orbit Bus
     * @param {Bus<any>} bus bus to link to
     * @returns {void}
     */
    static link(bus) {
        bus["__orbit_link_event__"](this.__create_void__().#__orbit_event__.name);
    }
    /**
     * ## Orbit Internal, **DO NOT USE**
     * @param {E} e Any object that extends an orbit Event
     * @returns {EventInternal} Orbit internal metadata of the event
     */
    static __raw_orbit_event__(e) { return e.#__orbit_event__; }
    static __create_void__() { return new this(); }
}
exports.Event = Event;
