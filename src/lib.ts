import { UnlinkedEventError } from "./errors";

interface EventInternal {
    name: string;
    creation_timestamp: number;
}
type Consumer<T> = (i: T) => void;

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
export class Bus<E extends Event> {
    #name: string;
    #registered_events: string[];
    #subscribers: Map<string,Consumer<E>[]> = new Map();
    #__orbit_validate__ = (e: E | string): string => {
        if(typeof e === "string") {
            if(!this.#registered_events.includes(e)) throw new UnlinkedEventError(e, this.#name);
            return e;
        }
        return this.#__orbit_validate__(Event.__raw_orbit_event__(e).name);
    }

    /**
     * @param {string | undefined} name The name of the bus
     */
    constructor(name?: string) {
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
    public on<E2 extends E>(eventname: string, func: Consumer<E2>): void {
        eventname = this.#__orbit_validate__(eventname);
        if(this.#subscribers.get(eventname)===undefined) this.#subscribers.set(eventname, []);
        this.#subscribers.get(eventname).push(func);
    }

    /**
     * ## Posts an event to the bus
     * @param {E} event event to post
     * @returns {void}
     * @throws {UnlinkedEventError} if the event is not linked to the bus
     * @throws {TypeError} if the event is not an instance of an orbit event
     */
    public post(event: E): void {
        let eventname = this.#__orbit_validate__(event);
        if(this.#subscribers.get(eventname)!==undefined) {
            this.#subscribers.get(eventname).forEach(func => func(event));
        }
    }

    private __orbit_link_event__ (event: string): void { this.#registered_events.push(event) }
}

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
export class Event {
    #__orbit_event__: EventInternal;
    constructor(name: string) {
        this.#__orbit_event__ = {
            creation_timestamp: Date.now(),
            name: name
        }
    }

    /**
     * # Links the event to any Orbit Bus
     * @param {Bus<any>} bus bus to link to
     * @returns {void}
     */
    public static link(bus: Bus<any>): void {
        bus["__orbit_link_event__"](this.__create_void__().#__orbit_event__.name);
    }

    /**
     * ## Orbit Internal, **DO NOT USE**
     * @param {E} e Any object that extends an orbit Event
     * @returns {EventInternal} Orbit internal metadata of the event
     */
    public static __raw_orbit_event__<E extends Event>(e: E): EventInternal { return e.#__orbit_event__; }
    private static __create_void__<E extends Event>(this: new (..._:any[]) => E): E { return new this(); }
}
