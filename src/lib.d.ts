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
export declare class Bus<E extends Event> {
    #private;
    /**
     * @param {string | undefined} name The name of the bus
     */
    constructor(name?: string);
    /**
     * ## Registers an event handler for a specific event
     * @param {string} eventname name of the event that it is listening (case sensitive)
     * @param {Consumer<E2>} func function that handles the event
     * @throws {UnlinkedEventError} if the event is not linked to the bus
     * @throws {TypeError} if the event is not an instance of an orbit event
     * @returns {void}
     */
    on<E2 extends E>(eventname: string, func: Consumer<E2>): void;
    /**
     * ## Posts an event to the bus
     * @param {E} event event to post
     * @returns {void}
     * @throws {UnlinkedEventError} if the event is not linked to the bus
     * @throws {TypeError} if the event is not an instance of an orbit event
     */
    post(event: E): void;
    private __orbit_link_event__;
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
export declare class Event {
    #private;
    constructor(name: string);
    /**
     * # Links the event to any Orbit Bus
     * @param {Bus<any>} bus bus to link to
     * @returns {void}
     */
    static link(bus: Bus<any>): void;
    /**
     * ## Orbit Internal, **DO NOT USE**
     * @param {E} e Any object that extends an orbit Event
     * @returns {EventInternal} Orbit internal metadata of the event
     */
    static __raw_orbit_event__<E extends Event>(e: E): EventInternal;
    private static __create_void__;
}
export {};